using Microsoft.Extensions.Options;

namespace Umbraco.VercelAnalytics.Configuration;

public sealed class VercelAnalyticsConnectionRegistry(
    VercelAnalyticsSettingsStore settingsStore,
    IOptions<VercelAnalyticsOptions> serverOptions)
{
    private readonly Lock _snapshotLock = new();
    private RegistrySnapshot? _snapshot;

    public VercelAnalyticsConnectionRegistry(IOptions<VercelAnalyticsOptions> serverOptions)
        : this(new VercelAnalyticsSettingsStore(serverOptions), serverOptions)
    {
    }

    public VercelAnalyticsSettings Settings => Capture().Settings;

    public IEnumerable<VercelAnalyticsConnection> Connections => Capture().Connections.Values;

    public VercelAnalyticsConnection? Get(string alias) =>
        Capture().Get(alias);

    public VercelAnalyticsConnection? FindByHostname(string? hostname)
    {
        var normalized = NormalizeHostname(hostname);
        if (normalized is null) return null;
        var snapshot = Capture();
        return snapshot.HostnameOwners.TryGetValue(normalized, out var alias)
            ? snapshot.Connections.GetValueOrDefault(alias)
            : null;
    }

    public VercelAnalyticsConnection? FindNearestRoot(IEnumerable<Guid> ancestorKeys)
    {
        var snapshot = Capture();
        foreach (var key in ancestorKeys)
        {
            if (snapshot.RootOwners.TryGetValue(key, out var alias))
            {
                return snapshot.Connections.GetValueOrDefault(alias);
            }
        }

        return null;
    }

    public static string? NormalizeHostname(string? hostname)
    {
        if (string.IsNullOrWhiteSpace(hostname)) return null;
        var value = hostname.Trim().TrimEnd('.').ToLowerInvariant();
        return Uri.CheckHostName(value) == UriHostNameType.Unknown ? null : value;
    }

    internal RegistrySnapshot Capture()
    {
        var settingsSnapshot = settingsStore.GetSnapshot();
        lock (_snapshotLock)
        {
            if (_snapshot?.Revision == settingsSnapshot.Revision)
            {
                return _snapshot;
            }

            _snapshot = CreateSnapshot(settingsSnapshot);
            return _snapshot;
        }
    }

    private RegistrySnapshot CreateSnapshot(VercelAnalyticsSettingsSnapshot settingsSnapshot)
    {
        var configuredTokens = serverOptions.Value.Connections;
        var connections = settingsSnapshot.Settings.Connections.ToDictionary(
            connection => connection.Alias,
            connection => VercelAnalyticsConnection.Create(
                connection,
                configuredTokens.GetValueOrDefault(connection.Alias)?.AccessToken),
            StringComparer.OrdinalIgnoreCase);
        var hostnames = connections.Values
            .SelectMany(connection => connection.Hostnames.Select(hostname => (hostname, connection.Alias)))
            .ToDictionary(pair => pair.hostname, pair => pair.Alias, StringComparer.OrdinalIgnoreCase);
        var roots = connections.Values
            .SelectMany(connection => connection.DocumentRootKeys.Select(rootKey => (rootKey, connection.Alias)))
            .ToDictionary(pair => pair.rootKey, pair => pair.Alias);
        return new RegistrySnapshot(
            settingsSnapshot.Settings,
            settingsSnapshot.Revision,
            connections,
            hostnames,
            roots);
    }

    internal sealed record RegistrySnapshot(
        VercelAnalyticsSettings Settings,
        long Revision,
        IReadOnlyDictionary<string, VercelAnalyticsConnection> Connections,
        IReadOnlyDictionary<string, string> HostnameOwners,
        IReadOnlyDictionary<Guid, string> RootOwners)
    {
        public VercelAnalyticsConnection? Get(string alias) => Connections.GetValueOrDefault(alias);
    }
}

public sealed record VercelAnalyticsConnection(
    string Alias,
    string DisplayName,
    string AccessToken,
    string ProjectId,
    string? TeamId,
    string? TeamSlug,
    IReadOnlySet<string> Hostnames,
    IReadOnlyList<Guid> DocumentRootKeys,
    bool EnableAllDocumentTypes,
    IReadOnlySet<Guid> EnabledDocumentTypeKeys,
    IReadOnlySet<string> EnabledDocumentTypes)
{
    public bool HasAccessToken => !string.IsNullOrWhiteSpace(AccessToken);

    public bool IsConfigured => HasAccessToken && !string.IsNullOrWhiteSpace(ProjectId);

    public bool HasMappings => Hostnames.Count > 0 || DocumentRootKeys.Count > 0;

    public bool IsDocumentTypeEnabled(string alias, Guid key) =>
        EnableAllDocumentTypes || EnabledDocumentTypeKeys.Contains(key) || EnabledDocumentTypes.Contains(alias);

    internal static VercelAnalyticsConnection Create(
        VercelAnalyticsConnectionSettings settings,
        string? accessToken) => new(
            settings.Alias,
            settings.DisplayName,
            accessToken ?? string.Empty,
            settings.ProjectId,
            NullIfWhiteSpace(settings.TeamId),
            NullIfWhiteSpace(settings.TeamSlug),
            settings.Hostnames.Select(VercelAnalyticsConnectionRegistry.NormalizeHostname).OfType<string>()
                .ToHashSet(StringComparer.OrdinalIgnoreCase),
            ParseGuidValues(settings.DocumentRootKeys),
            settings.EnableAllDocumentTypes,
            ParseGuidValues(settings.EnabledDocumentTypeKeys).ToHashSet(),
            settings.EnabledDocumentTypes.Select(value => value.Trim()).Where(value => value.Length > 0)
                .ToHashSet(StringComparer.OrdinalIgnoreCase));

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static IReadOnlyList<Guid> ParseGuidValues(IEnumerable<string> values) => values
        .Select(value => Guid.TryParse(value, out var parsed) ? parsed : (Guid?)null)
        .OfType<Guid>()
        .ToArray();
}

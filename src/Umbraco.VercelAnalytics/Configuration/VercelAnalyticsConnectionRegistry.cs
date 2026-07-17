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

    public VercelAnalyticsConnection? Get(Guid key) =>
        Capture().Get(key);

    public VercelAnalyticsConnection? FindNearestRoot(IEnumerable<Guid> ancestorKeys)
    {
        var snapshot = Capture();
        foreach (var key in ancestorKeys)
        {
            if (snapshot.RootOwners.TryGetValue(key, out var connectionKey))
            {
                return snapshot.Connections.GetValueOrDefault(connectionKey);
            }
        }

        return null;
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
        var serverConfiguration = serverOptions.Value;
        var connections = settingsSnapshot.Settings.Connections.ToDictionary(
            connection => connection.Key,
            connection => VercelAnalyticsConnection.Create(
                connection,
                ResolveAccessToken(
                    serverConfiguration.AccessToken,
                    serverConfiguration.ConnectionAccessTokens.GetValueOrDefault(connection.Key.ToString()))));
        var roots = connections.Values
            .SelectMany(connection => connection.DocumentRootKeys.Select(rootKey => (rootKey, connection.Key)))
            .ToDictionary(pair => pair.rootKey, pair => pair.Key);
        return new RegistrySnapshot(
            settingsSnapshot.Settings,
            settingsSnapshot.Revision,
            connections,
            roots);
    }

    private static string ResolveAccessToken(string? sharedAccessToken, string? connectionAccessToken) =>
        !string.IsNullOrWhiteSpace(connectionAccessToken)
            ? connectionAccessToken
            : sharedAccessToken ?? string.Empty;

    internal sealed record RegistrySnapshot(
        VercelAnalyticsSettings Settings,
        long Revision,
        IReadOnlyDictionary<Guid, VercelAnalyticsConnection> Connections,
        IReadOnlyDictionary<Guid, Guid> RootOwners)
    {
        public VercelAnalyticsConnection? Get(Guid key) => Connections.GetValueOrDefault(key);
    }
}

public sealed record VercelAnalyticsConnection(
    Guid Key,
    string DisplayName,
    string AccessToken,
    string ProjectId,
    string? Team,
    IReadOnlyList<Guid> DocumentRootKeys,
    bool EnableAllDocumentTypes,
    IReadOnlySet<Guid> EnabledDocumentTypeKeys,
    IReadOnlySet<string> EnabledDocumentTypes)
{
    public bool HasAccessToken => !string.IsNullOrWhiteSpace(AccessToken);

    public bool IsConfigured => HasAccessToken && !string.IsNullOrWhiteSpace(ProjectId);

    public bool HasMappings => DocumentRootKeys.Count > 0;

    public bool IsDocumentTypeEnabled(string documentTypeAlias, Guid documentTypeKey) =>
        EnableAllDocumentTypes || EnabledDocumentTypeKeys.Contains(documentTypeKey) || EnabledDocumentTypes.Contains(documentTypeAlias);

    internal static VercelAnalyticsConnection Create(
        VercelAnalyticsConnectionSettings settings,
        string? accessToken) => new(
            settings.Key,
            string.IsNullOrWhiteSpace(settings.DisplayName) ? settings.ProjectId : settings.DisplayName,
            accessToken ?? string.Empty,
            settings.ProjectId,
            NullIfWhiteSpace(settings.Team),
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

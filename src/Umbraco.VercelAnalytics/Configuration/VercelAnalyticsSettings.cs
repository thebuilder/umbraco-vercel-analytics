using System.Buffers.Binary;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Umbraco.Cms.Core.Services;

namespace Umbraco.VercelAnalytics.Configuration;

public sealed class VercelAnalyticsSettings
{
    public bool Enabled { get; set; }

    public string? DefaultConnection { get; set; }

    public int DefaultRangeDays { get; set; } = 30;

    public TimeSpan CacheDuration { get; set; } = TimeSpan.FromMinutes(5);

    public List<VercelAnalyticsConnectionSettings> Connections { get; set; } = [];
}

public sealed class VercelAnalyticsConnectionSettings
{
    public string Alias { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string ProjectId { get; set; } = string.Empty;

    public string? TeamId { get; set; }

    public string? TeamSlug { get; set; }

    public string[] Hostnames { get; set; } = [];

    public string[] DocumentRootKeys { get; set; } = [];

    public bool EnableAllDocumentTypes { get; set; }

    public string[] EnabledDocumentTypeKeys { get; set; } = [];

    // Retains compatibility with alias-based appsettings configuration.
    public string[] EnabledDocumentTypes { get; set; } = [];
}

public sealed class VercelAnalyticsSettingsStore
{
    private const string StorageKey = "Umbraco.VercelAnalytics.Settings.v1";
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);
    private readonly Lock _lock = new();
    private readonly IKeyValueService? _keyValueService;
    private readonly Microsoft.Extensions.Options.IOptions<VercelAnalyticsOptions> _serverOptions;
    private VercelAnalyticsSettings? _cached;
    private string? _cachedJson;
    private long _revision;

    public VercelAnalyticsSettingsStore(
        IKeyValueService keyValueService,
        Microsoft.Extensions.Options.IOptions<VercelAnalyticsOptions> serverOptions)
    {
        _keyValueService = keyValueService;
        _serverOptions = serverOptions;
    }

    public VercelAnalyticsSettingsStore(
        Microsoft.Extensions.Options.IOptions<VercelAnalyticsOptions> serverOptions)
    {
        _serverOptions = serverOptions;
    }

    public VercelAnalyticsSettings Get() => GetSnapshot().Settings;

    internal VercelAnalyticsSettingsSnapshot GetSnapshot()
    {
        lock (_lock)
        {
            var json = _keyValueService?.GetValue(StorageKey);
            if (_cached is null || (_keyValueService is not null && !string.Equals(json, _cachedJson, StringComparison.Ordinal)))
            {
                _cached = string.IsNullOrWhiteSpace(json)
                    ? VercelAnalyticsSettingsMapper.FromServerOptions(_serverOptions.Value)
                    : JsonSerializer.Deserialize<VercelAnalyticsSettings>(json, SerializerOptions)
                        ?? VercelAnalyticsSettingsMapper.FromServerOptions(_serverOptions.Value);
                _cachedJson = json;
                _revision = ComputeRevision(json ?? JsonSerializer.Serialize(_cached, SerializerOptions));
            }

            return new VercelAnalyticsSettingsSnapshot(_cached, _revision);
        }
    }

    public void Save(VercelAnalyticsSettings settings)
    {
        var normalized = Normalize(settings);
        var json = JsonSerializer.Serialize(normalized, SerializerOptions);
        lock (_lock)
        {
            _keyValueService?.SetValue(StorageKey, json);
            _cached = normalized;
            _cachedJson = json;
            _revision = ComputeRevision(json);
        }
    }

    private static VercelAnalyticsSettings Normalize(VercelAnalyticsSettings settings) => new()
    {
        Enabled = settings.Enabled,
        DefaultConnection = NullIfWhiteSpace(settings.DefaultConnection),
        DefaultRangeDays = settings.DefaultRangeDays,
        CacheDuration = settings.CacheDuration,
        Connections = settings.Connections.Select(connection => new VercelAnalyticsConnectionSettings
        {
            Alias = connection.Alias.Trim(),
            DisplayName = connection.DisplayName.Trim(),
            ProjectId = connection.ProjectId.Trim(),
            TeamId = NullIfWhiteSpace(connection.TeamId),
            TeamSlug = NullIfWhiteSpace(connection.TeamSlug),
            Hostnames = connection.Hostnames
                .Select(VercelAnalyticsConnectionRegistry.NormalizeHostname)
                .OfType<string>()
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            DocumentRootKeys = NormalizeGuidValues(connection.DocumentRootKeys),
            EnableAllDocumentTypes = connection.EnableAllDocumentTypes,
            EnabledDocumentTypeKeys = NormalizeGuidValues(connection.EnabledDocumentTypeKeys),
            EnabledDocumentTypes = connection.EnabledDocumentTypes
                .Select(value => value.Trim())
                .Where(value => value.Length > 0)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray()
        }).ToList()
    };

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static long ComputeRevision(string json) =>
        BinaryPrimitives.ReadInt64LittleEndian(SHA256.HashData(Encoding.UTF8.GetBytes(json))) & long.MaxValue;

    private static string[] NormalizeGuidValues(IEnumerable<string> values) => values
        .Select(value => Guid.TryParse(value, out var parsed) ? parsed.ToString() : null)
        .OfType<string>()
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray();
}

internal sealed record VercelAnalyticsSettingsSnapshot(
    VercelAnalyticsSettings Settings,
    long Revision);

internal static class VercelAnalyticsSettingsMapper
{
    public static VercelAnalyticsSettings FromServerOptions(VercelAnalyticsOptions options) => new()
    {
        Enabled = options.Enabled,
        DefaultConnection = string.IsNullOrWhiteSpace(options.DefaultConnection)
            ? options.Connections.Keys.FirstOrDefault()
            : options.DefaultConnection,
        DefaultRangeDays = options.DefaultRangeDays,
        CacheDuration = options.CacheDuration,
        Connections = options.Connections.Select(pair => new VercelAnalyticsConnectionSettings
        {
            Alias = pair.Key,
            DisplayName = pair.Value.DisplayName,
            ProjectId = pair.Value.ProjectId,
            TeamId = pair.Value.TeamId,
            TeamSlug = pair.Value.TeamSlug,
            Hostnames = pair.Value.Hostnames,
            DocumentRootKeys = pair.Value.DocumentRootKeys,
            EnableAllDocumentTypes = pair.Value.EnableAllDocumentTypes,
            EnabledDocumentTypeKeys = pair.Value.EnabledDocumentTypeKeys,
            EnabledDocumentTypes = pair.Value.EnabledDocumentTypes
        }).ToList()
    };
}

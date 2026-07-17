using Umbraco.VercelAnalytics.Configuration;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Services;

namespace Umbraco.VercelAnalytics.Tests.Configuration;

public sealed class VercelAnalyticsSettingsValidatorTests
{
    private static readonly Guid MainKey = Guid.Parse("11111111-1111-1111-1111-111111111110");
    [Fact]
    public void Roots_are_optional_for_global_reports()
    {
        var settings = CreateSettings();

        Assert.Empty(VercelAnalyticsSettingsValidator.Validate(settings));
    }

    [Fact]
    public void Duplicate_root_mappings_across_connections_are_rejected()
    {
        var settings = CreateSettings();
        settings.Connections[0].DocumentRootKeys = ["11111111-1111-1111-1111-111111111111"];
        settings.Connections.Add(new VercelAnalyticsConnectionSettings
        {
            Key = Guid.Parse("22222222-2222-2222-2222-222222222220"),
            DisplayName = "Other",
            ProjectId = "other-project",
            DocumentRootKeys = ["11111111-1111-1111-1111-111111111111"]
        });

        var failures = VercelAnalyticsSettingsValidator.Validate(settings);

        Assert.Contains(failures, failure => failure.Contains("assigned to both"));
    }

    [Fact]
    public void Document_type_keys_must_be_guids()
    {
        var settings = CreateSettings();
        settings.Connections[0].EnabledDocumentTypeKeys = ["not-a-guid"];

        var failures = VercelAnalyticsSettingsValidator.Validate(settings);

        Assert.Contains(failures, failure => failure.Contains("invalid document type key"));
    }

    [Fact]
    public void All_document_types_does_not_require_explicit_selections()
    {
        var settings = CreateSettings();
        settings.Connections[0].EnableAllDocumentTypes = true;

        Assert.Empty(VercelAnalyticsSettingsValidator.Validate(settings));
    }

    [Fact]
    public void Store_normalizes_non_secret_values_without_adding_a_token()
    {
        var store = new VercelAnalyticsSettingsStore(Options.Create(new VercelAnalyticsOptions()));
        var settings = CreateSettings();
        settings.Connections[0].DocumentRootKeys = ["11111111-1111-1111-1111-111111111111"];

        store.Save(settings);
        var connection = Assert.Single(store.Get().Connections);

        Assert.Equal("11111111-1111-1111-1111-111111111111", Assert.Single(connection.DocumentRootKeys));
        Assert.DoesNotContain("token", System.Text.Json.JsonSerializer.Serialize(connection), StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Store_generates_and_preserves_a_missing_connection_key()
    {
        var store = new VercelAnalyticsSettingsStore(Options.Create(new VercelAnalyticsOptions()));
        var settings = CreateSettings();
        settings.Connections[0].Key = Guid.Empty;

        store.Save(settings);
        var first = Assert.Single(store.Get().Connections).Key;
        var second = Assert.Single(store.Get().Connections).Key;

        Assert.NotEqual(Guid.Empty, first);
        Assert.Equal(first, second);
    }

    [Fact]
    public void Store_preserves_connection_order_from_server_options()
    {
        var secondKey = Guid.Parse("22222222-2222-2222-2222-222222222220");
        var options = new VercelAnalyticsOptions
        {
            Enabled = true,
            AccessToken = "server-secret",
            Connections =
            [
                new() { Key = MainKey, ProjectId = "first-project" },
                new() { Key = secondKey, ProjectId = "second-project" }
            ]
        };
        var store = new VercelAnalyticsSettingsStore(Options.Create(options));

        Assert.Equal([MainKey, secondKey], store.Get().Connections.Select(connection => connection.Key));
    }

    [Fact]
    public void Store_observes_settings_saved_by_another_application_node()
    {
        var values = new FakeKeyValueService();
        var options = Options.Create(new VercelAnalyticsOptions());
        var firstNode = new VercelAnalyticsSettingsStore(values, options);
        var secondNode = new VercelAnalyticsSettingsStore(values, options);
        var initial = CreateSettings();
        firstNode.Save(initial);
        var secondNodeInitialRevision = secondNode.GetSnapshot().Revision;

        Assert.Equal(firstNode.GetSnapshot().Revision, secondNodeInitialRevision);

        var changed = CreateSettings();
        changed.Connections[0].DisplayName = "Changed on another node";
        firstNode.Save(changed);
        var observed = secondNode.GetSnapshot();

        Assert.NotEqual(secondNodeInitialRevision, observed.Revision);
        Assert.Equal("Changed on another node", observed.Settings.Connections[0].DisplayName);
    }

    private static VercelAnalyticsSettings CreateSettings() => new()
    {
        Enabled = true,
        Connections =
        [
            new VercelAnalyticsConnectionSettings
            {
                Key = MainKey,
                DisplayName = "Main",
                ProjectId = "project"
            }
        ]
    };

    private sealed class FakeKeyValueService : IKeyValueService
    {
        private readonly Dictionary<string, string> _values = [];

        public string? GetValue(string key) => _values.GetValueOrDefault(key);

        public IReadOnlyDictionary<string, string?> FindByKeyPrefix(string keyPrefix) => _values
            .Where(pair => pair.Key.StartsWith(keyPrefix, StringComparison.Ordinal))
            .ToDictionary(pair => pair.Key, pair => (string?)pair.Value);

        public void SetValue(string key, string value) => _values[key] = value;

        public void SetValue(string key, string originValue, string newValue)
        {
            if (!TrySetValue(key, originValue, newValue))
            {
                throw new InvalidOperationException("The value changed before it could be updated.");
            }
        }

        public bool TrySetValue(string key, string originValue, string newValue)
        {
            if (!string.Equals(GetValue(key), originValue, StringComparison.Ordinal)) return false;
            _values[key] = newValue;
            return true;
        }
    }
}

using Microsoft.Extensions.Options;
using Umbraco.VercelAnalytics.Configuration;

namespace Umbraco.VercelAnalytics.Tests.Configuration;

public sealed class VercelAnalyticsOptionsValidatorTests
{
    private readonly VercelAnalyticsOptionsValidator _sut = new();

    [Fact]
    public void Disabled_configuration_is_valid_without_connections()
    {
        Assert.True(_sut.Validate(null, new VercelAnalyticsOptions()).Succeeded);
    }

    [Fact]
    public void Enabled_configuration_is_valid_before_ui_setup()
    {
        Assert.True(_sut.Validate(null, new VercelAnalyticsOptions { Enabled = true }).Succeeded);
    }

    [Fact]
    public void Token_only_connection_is_valid_before_ui_setup()
    {
        var options = new VercelAnalyticsOptions
        {
            Enabled = true,
            Connections = new Dictionary<string, VercelAnalyticsConnectionOptions>(StringComparer.OrdinalIgnoreCase)
            {
                ["main"] = new() { AccessToken = "server-secret" }
            }
        };

        Assert.True(_sut.Validate(null, options).Succeeded);
    }

    [Fact]
    public void Valid_configuration_succeeds()
    {
        var result = _sut.Validate(null, CreateOptions());

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Connection_without_mappings_is_valid_for_global_reports()
    {
        var options = CreateOptions();
        options.Connections["main"].Hostnames = [];
        options.Connections["main"].DocumentRootKeys = [];

        Assert.True(_sut.Validate(null, options).Succeeded);
    }

    [Fact]
    public void Duplicate_normalized_hostnames_fail()
    {
        var options = CreateOptions();
        options.Connections["other"] = CreateConnection(hostnames: ["EXAMPLE.COM."]);

        var result = _sut.Validate(null, options);

        Assert.Contains(result.Failures!, failure => failure.Contains("assigned to both"));
    }

    [Fact]
    public void Duplicate_root_keys_fail()
    {
        var options = CreateOptions();
        options.Connections["other"] = CreateConnection(rootKeys: ["11111111-1111-1111-1111-111111111111"]);

        var result = _sut.Validate(null, options);

        Assert.Contains(result.Failures!, failure => failure.Contains("Document root"));
    }

    [Fact]
    public void Team_id_and_slug_are_mutually_exclusive()
    {
        var options = CreateOptions();
        options.Connections["main"].TeamId = "team_id";
        options.Connections["main"].TeamSlug = "team-slug";

        var result = _sut.Validate(null, options);

        Assert.Contains(result.Failures!, failure => failure.Contains("both TeamId and TeamSlug"));
    }

    [Fact]
    public void Document_type_keys_are_validated_from_server_options()
    {
        var options = CreateOptions();
        options.Connections["main"].EnabledDocumentTypeKeys = ["not-a-guid"];

        var result = _sut.Validate(null, options);

        Assert.Contains(result.Failures!, failure => failure.Contains("invalid document type key"));
    }

    [Fact]
    public void Registry_does_not_throw_when_invalid_keys_bypass_startup_validation()
    {
        var options = CreateOptions();
        options.Connections["main"].DocumentRootKeys = ["not-a-guid"];
        options.Connections["main"].EnabledDocumentTypeKeys = ["also-not-a-guid"];
        var registry = new VercelAnalyticsConnectionRegistry(Options.Create(options));

        var connection = registry.Get("main");

        Assert.NotNull(connection);
        Assert.Empty(connection.DocumentRootKeys);
        Assert.Empty(connection.EnabledDocumentTypeKeys);
    }

    [Fact]
    public void Registry_reuses_one_snapshot_until_settings_change()
    {
        var options = CreateOptions();
        var optionsAccessor = Options.Create(options);
        var store = new VercelAnalyticsSettingsStore(optionsAccessor);
        var registry = new VercelAnalyticsConnectionRegistry(store, optionsAccessor);

        var first = registry.Capture();
        var second = registry.Capture();
        store.Save(new VercelAnalyticsSettings
        {
            Enabled = true,
            DefaultConnection = "main",
            Connections =
            [
                new VercelAnalyticsConnectionSettings
                {
                    Alias = "main",
                    DisplayName = "Changed",
                    ProjectId = "project-id"
                }
            ]
        });
        var changed = registry.Capture();

        Assert.Same(first, second);
        Assert.NotSame(first, changed);
        Assert.NotEqual(first.Revision, changed.Revision);
        Assert.Equal("Changed", changed.Get("main")?.DisplayName);
    }

    [Fact]
    public void Registry_prefers_nearest_root_order_and_normalizes_hostname()
    {
        var options = CreateOptions();
        options.Connections["root"] = CreateConnection(
            hostnames: ["root.example.com"],
            rootKeys: ["22222222-2222-2222-2222-222222222222"]);
        var registry = new VercelAnalyticsConnectionRegistry(Options.Create(options));

        var root = registry.FindNearestRoot([
            Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Guid.Parse("11111111-1111-1111-1111-111111111111")]);
        var hostname = registry.FindByHostname("EXAMPLE.COM.");

        Assert.Equal("root", root?.Alias);
        Assert.Equal("main", hostname?.Alias);
    }

    [Fact]
    public void Registry_supports_explicit_and_all_document_type_modes()
    {
        var options = CreateOptions();
        var explicitKey = Guid.Parse("33333333-3333-3333-3333-333333333333");
        options.Connections["main"].EnabledDocumentTypeKeys = [explicitKey.ToString()];
        var registry = new VercelAnalyticsConnectionRegistry(Options.Create(options));

        Assert.True(registry.Get("main")!.IsDocumentTypeEnabled("anything", explicitKey));
        Assert.False(registry.Get("main")!.IsDocumentTypeEnabled("anything", Guid.NewGuid()));

        options.Connections["main"].EnableAllDocumentTypes = true;
        registry = new VercelAnalyticsConnectionRegistry(Options.Create(options));
        Assert.True(registry.Get("main")!.IsDocumentTypeEnabled("newPage", Guid.NewGuid()));
    }

    private static VercelAnalyticsOptions CreateOptions() => new()
    {
        Enabled = true,
        DefaultConnection = "main",
        Connections = new Dictionary<string, VercelAnalyticsConnectionOptions>(StringComparer.OrdinalIgnoreCase)
        {
            ["main"] = CreateConnection()
        }
    };

    private static VercelAnalyticsConnectionOptions CreateConnection(
        string[]? hostnames = null,
        string[]? rootKeys = null) => new()
    {
        DisplayName = "Main site",
        AccessToken = "test-token",
        ProjectId = "project-id",
        Hostnames = hostnames ?? ["example.com"],
        DocumentRootKeys = rootKeys ?? ["11111111-1111-1111-1111-111111111111"],
        EnabledDocumentTypes = ["articlePage"]
    };
}

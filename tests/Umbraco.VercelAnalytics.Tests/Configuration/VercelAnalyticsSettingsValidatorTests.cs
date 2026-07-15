using Umbraco.VercelAnalytics.Configuration;

namespace Umbraco.VercelAnalytics.Tests.Configuration;

public sealed class VercelAnalyticsSettingsValidatorTests
{
    [Fact]
    public void Hostnames_and_roots_are_optional_for_global_reports()
    {
        var settings = CreateSettings();

        Assert.Empty(VercelAnalyticsSettingsValidator.Validate(settings));
    }

    [Fact]
    public void Duplicate_mappings_across_connections_are_rejected()
    {
        var settings = CreateSettings();
        settings.Connections[0].Hostnames = ["example.com"];
        settings.Connections.Add(new VercelAnalyticsConnectionSettings
        {
            Alias = "other",
            DisplayName = "Other",
            ProjectId = "other-project",
            Hostnames = ["EXAMPLE.COM."]
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

    private static VercelAnalyticsSettings CreateSettings() => new()
    {
        Enabled = true,
        DefaultConnection = "main",
        Connections =
        [
            new VercelAnalyticsConnectionSettings
            {
                Alias = "main",
                DisplayName = "Main",
                ProjectId = "project"
            }
        ]
    };
}

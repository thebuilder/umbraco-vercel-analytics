using System.Net;
using Microsoft.Extensions.DependencyInjection;
using TheBuilder.WebAnalytics.Models;
using TheBuilder.WebAnalytics.Providers;

namespace TheBuilder.WebAnalytics.Configuration;

public sealed class AnalyticsProviderCatalog
{
    public static AnalyticsProviderCatalog Default { get; } = new();

    private readonly IReadOnlyDictionary<AnalyticsProvider, AnalyticsProviderDefinition> _definitions;

    private AnalyticsProviderCatalog()
    {
        Definitions =
        [
            VercelProvider.Definition,
            PlausibleProvider.Definition
        ];
        _definitions = Definitions.ToDictionary(definition => definition.Provider);
    }

    public IReadOnlyList<AnalyticsProviderDefinition> Definitions { get; }

    public AnalyticsProviderDefinition Get(AnalyticsProvider provider) =>
        _definitions.TryGetValue(provider, out var definition)
            ? definition
            : throw new ArgumentOutOfRangeException(nameof(provider), provider, "Unsupported analytics provider.");

    public bool TryGet(AnalyticsProvider provider, out AnalyticsProviderDefinition definition) =>
        _definitions.TryGetValue(provider, out definition!);
}

public sealed class AnalyticsProviderDefinition(
    AnalyticsProvider provider,
    AnalyticsCapabilities capabilities,
    AnalyticsConnectionIdentifier identifier,
    AnalyticsProviderSettingsDescriptor settings,
    Func<WebAnalyticsOptions, string> accessToken,
    Action<IServiceCollection, AnalyticsProviderDefinition>? registerClient = null,
    IReadOnlySet<HttpStatusCode>? invalidQueryStatuses = null)
{
    private readonly IReadOnlySet<HttpStatusCode> _invalidQueryStatuses =
        invalidQueryStatuses ?? new HashSet<HttpStatusCode> { HttpStatusCode.BadRequest };

    public AnalyticsProvider Provider { get; } = provider;

    public AnalyticsCapabilities Capabilities { get; } = capabilities;

    public AnalyticsConnectionIdentifier Identifier { get; } = identifier;

    public bool SupportsTeam => Settings.Team is not null;

    public AnalyticsProviderSettingsDescriptor Settings { get; } = settings;

    public string GetAccessToken(WebAnalyticsOptions options) => accessToken(options);

    public AnalyticsProviderDescriptor ToDescriptor() => new(
        Provider,
        Settings.Description,
        Settings.LogoSlug,
        Settings.Identifier,
        Settings.Team,
        Settings.Credential,
        Settings.EventProperties);

    public string GetIdentifier(AnalyticsConnectionSettings connection) => Identifier switch
    {
        AnalyticsConnectionIdentifier.ProjectId => connection.ProjectId,
        AnalyticsConnectionIdentifier.SiteId => connection.SiteId,
        _ => string.Empty
    };

    public string GetIdentifier(AnalyticsConnection connection) => Identifier switch
    {
        AnalyticsConnectionIdentifier.ProjectId => connection.ProjectId,
        AnalyticsConnectionIdentifier.SiteId => connection.SiteId,
        _ => string.Empty
    };

    public AnalyticsProviderFields Normalize(AnalyticsConnectionSettings connection) => new(
        !connection.IsMock && Identifier == AnalyticsConnectionIdentifier.ProjectId ? connection.ProjectId.Trim() : string.Empty,
        !connection.IsMock && Settings.Team is not null ? NullIfWhiteSpace(connection.Team) : null,
        !connection.IsMock && Identifier == AnalyticsConnectionIdentifier.SiteId ? connection.SiteId.Trim() : string.Empty,
        !connection.IsMock && Settings.EventProperties is not null
            ? NormalizeNames(connection.EventPropertyNames ?? [])
            : []);

    public void ValidateConnection(
        AnalyticsConnectionSettings connection,
        string label,
        bool requireConnectionMetadata,
        bool isSupportedMockScenario,
        ICollection<string> failures)
    {
        if (requireConnectionMetadata && !isSupportedMockScenario && string.IsNullOrWhiteSpace(GetIdentifier(connection)))
            failures.Add($"Connection '{label}' requires {Settings.Identifier.RequiredMessage}.");

        if (!string.IsNullOrWhiteSpace(connection.ProjectId) &&
            (isSupportedMockScenario || Identifier != AnalyticsConnectionIdentifier.ProjectId))
            failures.Add($"Connection '{label}' cannot define a {AnalyticsConnectionFields.ProjectId.Label}.");
        if (!string.IsNullOrWhiteSpace(connection.Team) && (isSupportedMockScenario || !SupportsTeam))
            failures.Add($"Connection '{label}' cannot define a {AnalyticsConnectionFields.Team.Label}.");
        if (!string.IsNullOrWhiteSpace(connection.SiteId) &&
            (isSupportedMockScenario || Identifier != AnalyticsConnectionIdentifier.SiteId))
            failures.Add($"Connection '{label}' cannot define a {AnalyticsConnectionFields.SiteId.Label}.");

        var eventPropertyNames = connection.EventPropertyNames ?? [];
        if (Settings.EventProperties is { } eventProperties)
        {
            if (eventPropertyNames.Count(value => !string.IsNullOrWhiteSpace(value)) > eventProperties.MaximumNames)
                failures.Add($"Connection '{label}' cannot define more than {eventProperties.MaximumNames} event properties.");
            if (eventPropertyNames.Any(value => value is null || value.Trim().Length > eventProperties.MaximumNameLength || value.Any(char.IsControl)))
                failures.Add($"Connection '{label}' contains an invalid event property name.");
        }

        if (eventPropertyNames.Any(value => !string.IsNullOrWhiteSpace(value)) &&
            (Settings.EventProperties is null || isSupportedMockScenario))
            failures.Add($"Connection '{label}' cannot define {Settings.EventProperties?.Label ?? "event properties"} for {Provider}.");
    }

    public bool IsInvalidQuery(HttpStatusCode statusCode) => _invalidQueryStatuses.Contains(statusCode);

    internal void RegisterClient(IServiceCollection services)
    {
        if (registerClient is null)
            throw new InvalidOperationException($"No analytics client registration is configured for {Provider}.");
        registerClient(services, this);
    }

    public string ConnectionTestFailure(HttpStatusCode statusCode) => statusCode switch
    {
        HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden =>
            $"{Provider} rejected the configured credentials or connection access.",
        HttpStatusCode.PaymentRequired =>
            $"The analytics API is unavailable for the current {Provider} plan or reporting window.",
        HttpStatusCode.TooManyRequests =>
            $"{Provider} rate-limited the connection test. Try again shortly.",
        _ when IsInvalidQuery(statusCode) =>
            $"{Provider} rejected the connection identifier or analytics query.",
            _ => $"{Provider} Analytics is temporarily unavailable."
    };

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static string[] NormalizeNames(IEnumerable<string> values) => values
        .Select(value => value.Trim())
        .Where(value => value.Length > 0)
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray();
}

public sealed record AnalyticsProviderSettingsDescriptor(
    string Description,
    string LogoSlug,
    AnalyticsIdentifierFieldDescriptor Identifier,
    AnalyticsOptionalFieldDescriptor? Team,
    AnalyticsCredentialDescriptor Credential,
    AnalyticsEventPropertyDescriptor? EventProperties);

public sealed record AnalyticsIdentifierFieldDescriptor(
    string Key,
    string Label,
    string Description,
    string RequiredMessage);

public sealed record AnalyticsCredentialDescriptor(
    string Label,
    string Description,
    string DocumentationUrl);

public sealed record AnalyticsOptionalFieldDescriptor(
    string Key,
    string Label,
    string Description);

public sealed record AnalyticsEventPropertyDescriptor(
    string Label,
    string Description,
    int MaximumNames,
    int MaximumNameLength);

public sealed record AnalyticsProviderFields(
    string ProjectId,
    string? Team,
    string SiteId,
    string[] EventPropertyNames);

internal static class AnalyticsConnectionFields
{
    internal static AnalyticsFlatConnectionField ProjectId { get; } = new("projectId", "Vercel project ID");
    internal static AnalyticsFlatConnectionField Team { get; } = new("team", "Vercel team");
    internal static AnalyticsFlatConnectionField SiteId { get; } = new("siteId", "Plausible site ID");
}

internal sealed record AnalyticsFlatConnectionField(string Key, string Label);

public enum AnalyticsConnectionIdentifier
{
    ProjectId,
    SiteId
}

using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Security;
using Umbraco.Extensions;
using TheBuilder.WebAnalytics.Configuration;
using TheBuilder.WebAnalytics.Models;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "TheBuilder.WebAnalytics")]
public sealed class WebAnalyticsSettingsApiController(
    IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
    WebAnalyticsSettingsStore settingsStore,
    AnalyticsConnectionRegistry registry,
    IOptions<WebAnalyticsOptions> serverOptions,
    IAnalyticsProviderClient providerClient,
    IAnalyticsConnectionNameService projectNames) : WebAnalyticsApiControllerBase
{
    [HttpGet("settings")]
    [ProducesResponseType<AnalyticsSettingsResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<AnalyticsSettingsResponse>> Settings(CancellationToken cancellationToken)
    {
        if (!IsAdministrator()) return Forbid();
        return Ok(await CreateResponseAsync(cancellationToken));
    }

    [HttpPut("settings")]
    [ProducesResponseType<AnalyticsSettingsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AnalyticsSettingsResponse>> SaveSettings(
        UpdateAnalyticsSettingsRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsAdministrator()) return Forbid();
        if (!TimeSpan.TryParse(request.CacheDuration, out var cacheDuration))
            return InvalidSettings(["Cache duration must use the format hh:mm:ss."]);
        var existingProviders = settingsStore.Get().Connections.ToDictionary(connection => connection.Key, connection => connection.Provider);
        var changedProvider = request.Connections.FirstOrDefault(connection =>
            existingProviders.TryGetValue(connection.Key, out var existingProvider) && existingProvider != connection.Provider);
        if (changedProvider is not null)
            return InvalidSettings([$"Connection '{changedProvider.Key}' cannot change analytics provider. Create a new connection instead."]);

        var settings = new WebAnalyticsSettings
        {
            Enabled = request.Enabled,
            DefaultRangeDays = request.DefaultRangeDays,
            CacheDuration = cacheDuration,
            Connections = request.Connections.Select(connection => new AnalyticsConnectionSettings
            {
                Key = connection.Key,
                DisplayName = connection.DisplayName,
                Provider = connection.Provider,
                ProjectId = connection.ProjectId,
                Team = connection.Team,
                SiteId = connection.SiteId,
                MockScenario = connection.MockScenario,
                DocumentRootKeys = connection.DocumentRootKeys.ToArray(),
                EnableAllDocumentTypes = connection.EnableAllDocumentTypes,
                EnabledDocumentTypeKeys = connection.EnabledDocumentTypeKeys.ToArray()
            }).ToList()
        };
        var failures = WebAnalyticsSettingsValidator.Validate(settings);
        if (failures.Count > 0) return InvalidSettings(failures);

        settingsStore.Save(settings);
        return Ok(await CreateResponseAsync(cancellationToken));
    }

    [HttpPost("settings/connections/{key:guid}/test")]
    [ProducesResponseType<AnalyticsConnectionTestResult>(StatusCodes.Status200OK)]
    public async Task<ActionResult<AnalyticsConnectionTestResult>> TestConnection(
        Guid key,
        CancellationToken cancellationToken)
    {
        if (!IsAdministrator()) return Forbid();
        var connection = registry.Get(key);
        if (connection is null) return NotFound();
        if (!connection.IsConfigured)
            return Ok(new AnalyticsConnectionTestResult(false, $"Add a server-side {connection.Provider} access token and identifier."));

        try
        {
            var now = DateTimeOffset.UtcNow;
            await providerClient.CountAsync(
                connection,
                new AnalyticsQuery(key, now.AddDays(-1), now, AnalyticsInterval.Hour),
                cancellationToken);
            return Ok(new AnalyticsConnectionTestResult(true, "The analytics connection is ready."));
        }
        catch (AnalyticsProviderApiException exception)
        {
            var message = (exception.Provider, exception.StatusCode) switch
            {
                (AnalyticsProvider.Vercel, System.Net.HttpStatusCode.Unauthorized or System.Net.HttpStatusCode.Forbidden) =>
                    "Vercel rejected the token or its project/team permissions.",
                (AnalyticsProvider.Vercel, System.Net.HttpStatusCode.PaymentRequired) =>
                    "Web Analytics is unavailable for the current Vercel plan or reporting window.",
                (AnalyticsProvider.Vercel, System.Net.HttpStatusCode.BadRequest) =>
                    "Vercel rejected the project or team configuration.",
                (AnalyticsProvider.Plausible, System.Net.HttpStatusCode.Unauthorized or System.Net.HttpStatusCode.Forbidden) =>
                    "Plausible rejected the Stats API key or site access.",
                (AnalyticsProvider.Plausible, System.Net.HttpStatusCode.PaymentRequired) =>
                    "The Plausible Stats API is unavailable for the current plan.",
                (AnalyticsProvider.Plausible, System.Net.HttpStatusCode.BadRequest or System.Net.HttpStatusCode.NotFound) =>
                    "Plausible rejected the site ID or analytics query.",
                (AnalyticsProvider.Plausible, System.Net.HttpStatusCode.TooManyRequests) =>
                    "Plausible rate-limited the connection test. Try again shortly.",
                _ => $"{connection.Provider} Analytics is temporarily unavailable."
            };
            return Ok(new AnalyticsConnectionTestResult(false, message));
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return Ok(new AnalyticsConnectionTestResult(false, $"{connection.Provider} Analytics did not respond before the request timed out."));
        }
        catch (HttpRequestException)
        {
            return Ok(new AnalyticsConnectionTestResult(false, $"{connection.Provider} Analytics could not be reached."));
        }
        catch (System.Text.Json.JsonException)
        {
            return Ok(new AnalyticsConnectionTestResult(false, $"{connection.Provider} returned an unexpected analytics response."));
        }
    }

    private async Task<AnalyticsSettingsResponse> CreateResponseAsync(CancellationToken cancellationToken)
    {
        var settings = settingsStore.Get();
        var serverConfiguration = serverOptions.Value;
        var vercelConfiguration = serverConfiguration.Providers.Vercel;
        var connections = registry.Connections.ToDictionary(connection => connection.Key);
        var responseTasks = settings.Connections.Select(async connection =>
        {
            var registered = connections.GetValueOrDefault(connection.Key);
            var displayName = connection.IsMock
                ? connection.DisplayName
                : registered is null
                    ? connection.Provider == AnalyticsProvider.Plausible ? connection.SiteId : connection.ProjectId
                    : await projectNames.GetDisplayNameAsync(registered, cancellationToken);
            return new AnalyticsConnectionSettingsResponse(
                connection.Key,
                displayName,
                connection.Provider,
                connection.ProjectId,
                connection.Team,
                connection.SiteId,
                registered?.Capabilities ?? AnalyticsProviderCapabilities.For(AnalyticsConnection.Create(connection, null)),
                connection.DocumentRootKeys,
                connection.EnableAllDocumentTypes,
                connection.EnabledDocumentTypeKeys,
                registered?.HasAccessToken is true,
                !string.IsNullOrWhiteSpace(serverConfiguration.ConnectionAccessTokens.GetValueOrDefault(connection.Key.ToString())),
                connection.MockScenario);
        });
        var responseConnections = await Task.WhenAll(responseTasks);
        return new AnalyticsSettingsResponse(
            settings.Enabled,
            [
                new(AnalyticsProvider.Vercel, !string.IsNullOrWhiteSpace(vercelConfiguration.AccessToken)),
                new(AnalyticsProvider.Plausible, !string.IsNullOrWhiteSpace(serverConfiguration.Providers.Plausible.AccessToken))
            ],
            registry.MockConnectionsEnabled,
            settings.DefaultRangeDays,
            settings.CacheDuration.ToString("c"),
            responseConnections);
    }

    private bool IsAdministrator() =>
        backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser?.IsAdmin() is true;

    private ActionResult InvalidSettings(IReadOnlyList<string> failures) =>
        Problem(
            statusCode: StatusCodes.Status400BadRequest,
            title: "Analytics settings are invalid.",
            detail: string.Join(" ", failures));
}

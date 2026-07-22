using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Moq;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Security;
using TheBuilder.WebAnalytics.Configuration;
using TheBuilder.WebAnalytics.Controllers;
using TheBuilder.WebAnalytics.Models;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Tests.Controllers;

public sealed class WebAnalyticsSettingsApiControllerTests
{
    private static readonly Guid MockKey = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Settings_preserve_mock_identity_and_report_runtime_availability(bool mockConnectionsEnabled)
    {
        var options = Options.Create(new WebAnalyticsOptions
        {
            Providers = { Vercel = { AccessToken = "server-secret" } }
        });
        var store = new WebAnalyticsSettingsStore(options);
        store.Save(new WebAnalyticsSettings
        {
            Enabled = true,
            Connections =
            [
                new()
                {
                    Key = MockKey,
                    DisplayName = "Mock · Feature flags",
                    MockScenario = MockAnalyticsScenario.Flags
                }
            ]
        });
        var registry = new AnalyticsConnectionRegistry(store, options, mockConnectionsEnabled);
        var controller = new WebAnalyticsSettingsApiController(
            CreateAdministratorSecurityAccessor(),
            store,
            registry,
            options,
            new TestAnalyticsProviderClientResolver(Mock.Of<IAnalyticsProviderClient>(MockBehavior.Strict)),
            Mock.Of<IAnalyticsConnectionNameService>(MockBehavior.Strict));

        var result = await controller.Settings(CancellationToken.None);

        var response = Assert.IsType<AnalyticsSettingsResponse>(Assert.IsType<OkObjectResult>(result.Result).Value);
        Assert.Equal("0.1.0", response.PackageVersion);
        var connection = Assert.Single(response.Connections);
        Assert.Equal(MockAnalyticsScenario.Flags, connection.MockScenario);
        Assert.Equal(mockConnectionsEnabled, response.CanCreateMockConnections);
        var vercel = Assert.Single(response.Providers, provider => provider.Provider == AnalyticsProvider.Vercel);
        Assert.Equal("projectId", vercel.Identifier.Key);
        Assert.NotNull(vercel.Team);
        Assert.Null(vercel.EventProperties);
        Assert.True(vercel.Capabilities.Events);
        Assert.True(vercel.Capabilities.Flags);
        var plausible = Assert.Single(response.Providers, provider => provider.Provider == AnalyticsProvider.Plausible);
        Assert.Equal("siteId", plausible.Identifier.Key);
        Assert.Null(plausible.Team);
        Assert.Equal(20, plausible.EventProperties?.MaximumNames);
        Assert.True(plausible.Capabilities.Events);
        Assert.False(plausible.Capabilities.Flags);
        Assert.True(connection.EnableEvents);
        Assert.True(connection.EnableFlags);
        Assert.DoesNotContain("server-secret", JsonSerializer.Serialize(response), StringComparison.Ordinal);
    }

    [Fact]
    public async Task Save_settings_returns_bad_request_for_an_undefined_mock_scenario()
    {
        var options = Options.Create(new WebAnalyticsOptions());
        var store = new WebAnalyticsSettingsStore(options);
        var controller = new WebAnalyticsSettingsApiController(
            CreateAdministratorSecurityAccessor(),
            store,
            new AnalyticsConnectionRegistry(store, options, mockConnectionsEnabled: true),
            options,
            new TestAnalyticsProviderClientResolver(Mock.Of<IAnalyticsProviderClient>(MockBehavior.Strict)),
            Mock.Of<IAnalyticsConnectionNameService>(MockBehavior.Strict));
        var request = new UpdateAnalyticsSettingsRequest(
            true,
            30,
            "00:05:00",
            [
                new UpdateAnalyticsConnectionRequest
                {
                    Key = MockKey,
                    DisplayName = "Unknown mock",
                    Provider = AnalyticsProvider.Vercel,
                    ProjectId = string.Empty,
                    SiteId = string.Empty,
                    MockScenario = (MockAnalyticsScenario)999,
                    DocumentRootKeys = [],
                    EnableAllDocumentTypes = false,
                    EnabledDocumentTypeKeys = []
                }
            ]);

        var result = await controller.SaveSettings(request, CancellationToken.None);

        var response = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
        var problem = Assert.IsType<ProblemDetails>(response.Value);
        Assert.Contains("unsupported mock analytics scenario", problem.Detail);
    }

    [Fact]
    public async Task Save_settings_rejects_changing_provider_for_an_existing_connection()
    {
        var options = Options.Create(new WebAnalyticsOptions());
        var store = new WebAnalyticsSettingsStore(options);
        store.Save(new WebAnalyticsSettings
        {
            Connections = [new() { Key = MockKey, Provider = AnalyticsProvider.Vercel, ProjectId = "prj_example" }]
        });
        var controller = new WebAnalyticsSettingsApiController(
            CreateAdministratorSecurityAccessor(),
            store,
            new AnalyticsConnectionRegistry(store, options, mockConnectionsEnabled: false),
            options,
            new TestAnalyticsProviderClientResolver(Mock.Of<IAnalyticsProviderClient>(MockBehavior.Strict)),
            Mock.Of<IAnalyticsConnectionNameService>(MockBehavior.Strict));
        var request = new UpdateAnalyticsSettingsRequest(
            true,
            30,
            "00:05:00",
            [
                new()
                {
                    Key = MockKey,
                    DisplayName = "Example",
                    Provider = AnalyticsProvider.Plausible,
                    ProjectId = string.Empty,
                    SiteId = "example.com",
                    DocumentRootKeys = [],
                    EnableAllDocumentTypes = false,
                    EnabledDocumentTypeKeys = []
                }
            ]);

        var result = await controller.SaveSettings(request, CancellationToken.None);

        var response = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
        Assert.Contains("cannot change analytics provider", Assert.IsType<ProblemDetails>(response.Value).Detail);
    }

    private static IBackOfficeSecurityAccessor CreateAdministratorSecurityAccessor()
    {
        var administratorGroup = new Mock<IReadOnlyUserGroup>();
        administratorGroup.SetupGet(group => group.Alias).Returns("admin");
        var user = new Mock<IUser>();
        user.SetupGet(value => value.Groups).Returns([administratorGroup.Object]);
        var security = new Mock<IBackOfficeSecurity>();
        security.SetupGet(value => value.CurrentUser).Returns(user.Object);
        var accessor = new Mock<IBackOfficeSecurityAccessor>();
        accessor.SetupGet(value => value.BackOfficeSecurity).Returns(security.Object);
        return accessor.Object;
    }
}

using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Controllers;
using Umbraco.VercelAnalytics.Models;
using Umbraco.VercelAnalytics.Services;

namespace Umbraco.VercelAnalytics.Tests.Controllers;

public sealed class UmbracoVercelAnalyticsApiControllerTests
{
    [Fact]
    public void Base_controller_requires_authenticated_backoffice_access()
    {
        var authorize = Assert.Single(
            typeof(UmbracoVercelAnalyticsApiControllerBase)
                .GetCustomAttributes<AuthorizeAttribute>());

        Assert.Equal(AuthorizationPolicies.BackOfficeAccess, authorize.Policy);
    }

    [Fact]
    public async Task Connections_forbids_users_without_analytics_section_access()
    {
        var authorization = new Mock<IAnalyticsAuthorizationService>(MockBehavior.Strict);
        authorization.Setup(service => service.HasAnalyticsSectionAccess()).Returns(false);
        var controller = new UmbracoVercelAnalyticsApiController(
            authorization.Object,
            null!,
            null!,
            null!);

        var response = await controller.Connections(CancellationToken.None);

        Assert.IsType<ForbidResult>(response.Result);
    }

    [Fact]
    public async Task Connections_resolves_connection_base_urls_concurrently()
    {
        var authorization = new Mock<IAnalyticsAuthorizationService>(MockBehavior.Strict);
        authorization.Setup(service => service.HasAnalyticsSectionAccess()).Returns(true);
        var allStarted = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var release = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var started = 0;
        var routes = new Mock<IAnalyticsDocumentRouteService>(MockBehavior.Strict);
        routes
            .Setup(service => service.GetConnectionBaseUrlAsync(
                It.IsAny<VercelAnalyticsConnection>(),
                It.IsAny<CancellationToken>()))
            .Returns(async () =>
            {
                if (Interlocked.Increment(ref started) == 2) allStarted.TrySetResult();
                await release.Task;
                return "https://example.com";
            });
        var controller = new UmbracoVercelAnalyticsApiController(
            authorization.Object,
            EnabledRegistry("main", "secondary"),
            null!,
            routes.Object);

        var responseTask = controller.Connections(CancellationToken.None);
        await allStarted.Task.WaitAsync(TimeSpan.FromSeconds(2));
        release.SetResult();
        var response = await responseTask;

        var ok = Assert.IsType<OkObjectResult>(response.Result);
        var payload = Assert.IsType<AnalyticsConnectionsResponse>(ok.Value);
        Assert.Equal(2, payload.Connections.Count);
    }

    [Fact]
    public async Task Document_routes_forbid_users_without_document_browse_permission()
    {
        var documentId = Guid.NewGuid();
        var authorization = new Mock<IAnalyticsAuthorizationService>(MockBehavior.Strict);
        authorization
            .Setup(service => service.CanBrowseDocumentAsync(documentId))
            .ReturnsAsync(false);
        var controller = new UmbracoVercelAnalyticsApiController(
            authorization.Object,
            null!,
            null!,
            null!);

        var response = await controller.DocumentRoutes(documentId, null, CancellationToken.None);

        Assert.IsType<ForbidResult>(response.Result);
    }

    [Fact]
    public async Task Document_summary_rejects_a_path_not_returned_for_the_document()
    {
        var documentId = Guid.NewGuid();
        var authorization = new Mock<IAnalyticsAuthorizationService>(MockBehavior.Strict);
        authorization
            .Setup(service => service.HasContentSectionAccess())
            .Returns(true);
        authorization
            .Setup(service => service.CanBrowseDocumentAsync(documentId))
            .ReturnsAsync(true);
        var routes = new Mock<IAnalyticsDocumentRouteService>(MockBehavior.Strict);
        routes.Setup(service => service.GetRoutesAsync(documentId, "en-US", It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new AnalyticsDocumentRoute(
                    "main",
                    "en-US",
                    "example.com",
                    "/published",
                    "https://example.com/published",
                    true,
                    [])
            ]);
        var controller = new UmbracoVercelAnalyticsApiController(
            authorization.Object,
            EnabledRegistry(),
            null!,
            routes.Object);

        var response = await controller.Summary(
            "main",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 2),
            AnalyticsInterval.Day,
            documentId,
            "en-US",
            "/not-this-document",
            null,
            CancellationToken.None);

        AssertInvalidQuery(response.Result);
        authorization.VerifyAll();
        routes.VerifyAll();
    }

    [Fact]
    public async Task Document_summary_forbids_users_without_content_section_access_even_when_they_can_browse_the_document()
    {
        var documentId = Guid.NewGuid();
        var authorization = new Mock<IAnalyticsAuthorizationService>(MockBehavior.Strict);
        authorization
            .Setup(service => service.HasContentSectionAccess())
            .Returns(false);
        var controller = new UmbracoVercelAnalyticsApiController(
            authorization.Object,
            EnabledRegistry(),
            null!,
            null!);

        var response = await controller.Summary(
            "main",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 2),
            AnalyticsInterval.Day,
            documentId,
            "en-US",
            "/published",
            null,
            CancellationToken.None);

        Assert.IsType<ForbidResult>(response.Result);
        authorization.VerifyAll();
    }

    [Fact]
    public async Task Breakdown_rejects_undefined_numeric_dimension_before_dispatch()
    {
        var controller = CreateBoundaryOnlyController();

        var response = await controller.Breakdown(
            (AnalyticsDimension)999,
            "main",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 2),
            AnalyticsInterval.Day);

        AssertInvalidQuery(response.Result);
    }

    [Fact]
    public async Task Summary_rejects_undefined_numeric_interval_before_dispatch()
    {
        var controller = CreateBoundaryOnlyController();

        var response = await controller.Summary(
            "main",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 2),
            (AnalyticsInterval)999,
            null,
            null,
            null,
            null,
            CancellationToken.None);

        AssertInvalidQuery(response.Result);
    }

    [Fact]
    public async Task Summary_rejects_event_name_filter_in_visit_scope_before_dispatch()
    {
        var controller = CreateBoundaryOnlyController();

        var response = await controller.Summary(
            "main",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 2),
            AnalyticsInterval.Day,
            null,
            null,
            null,
            ["EventName:Signup"],
            CancellationToken.None);

        AssertInvalidQuery(response.Result);
        var problem = Assert.IsType<AnalyticsProblemDetails>(Assert.IsType<ObjectResult>(response.Result).Value);
        Assert.Contains("only supported by the event list report", problem.Detail);
    }

    [Fact]
    public async Task Event_details_rejects_event_name_filter_from_the_shared_query()
    {
        var controller = CreateBoundaryOnlyController();

        var response = await controller.EventDetails(
            "main",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 2),
            AnalyticsInterval.Day,
            "Signup",
            filter: ["EventName:AnotherEvent"]);

        AssertInvalidQuery(response.Result);
    }

    [Fact]
    public async Task Event_property_values_reject_event_name_filter_from_the_shared_query()
    {
        var controller = CreateBoundaryOnlyController();

        var response = await controller.EventPropertyValues(
            "main",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 2),
            AnalyticsInterval.Day,
            "Signup",
            "plan",
            filter: ["EventName:AnotherEvent"]);

        AssertInvalidQuery(response.Result);
    }

    private static UmbracoVercelAnalyticsApiController CreateBoundaryOnlyController() =>
        new(null!, null!, null!, null!);

    private static VercelAnalyticsConnectionRegistry EnabledRegistry(params string[] aliases) =>
        new(Options.Create(new VercelAnalyticsOptions
        {
            Enabled = true,
            DefaultConnection = aliases.FirstOrDefault() ?? "main",
            Connections = (aliases.Length == 0 ? ["main"] : aliases).ToDictionary(
                alias => alias,
                alias => new VercelAnalyticsConnectionOptions
                {
                    DisplayName = alias,
                    ProjectId = "project",
                    AccessToken = "secret",
                    Hostnames = [$"{alias}.example.com"],
                    EnableAllDocumentTypes = true
                },
                StringComparer.OrdinalIgnoreCase)
        }));

    private static void AssertInvalidQuery(ActionResult? result)
    {
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status400BadRequest, objectResult.StatusCode);
        var problem = Assert.IsType<AnalyticsProblemDetails>(objectResult.Value);
        Assert.Equal(VercelAnalyticsProblemCodes.InvalidQuery, problem.Code);
    }
}

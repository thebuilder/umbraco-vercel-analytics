using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using TheBuilder.WebAnalytics.Controllers;
using TheBuilder.WebAnalytics.Models;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Tests.Controllers;

public sealed class WebAnalyticsProblemFactoryTests
{
    [Fact]
    public void Maps_credential_failures_to_stable_problem_code()
    {
        var problem = Assert.IsType<WebAnalyticsProblemDefinition>(
            WebAnalyticsProblemFactory.FromException(
                new AnalyticsProviderApiException(HttpStatusCode.Forbidden, AnalyticsProvider.Vercel)));

        Assert.Equal(StatusCodes.Status502BadGateway, problem.Status);
        Assert.Equal(WebAnalyticsProblemCodes.InvalidCredentials, problem.Code);
    }

    [Theory]
    [InlineData(HttpStatusCode.PaymentRequired, StatusCodes.Status402PaymentRequired, WebAnalyticsProblemCodes.PlanLimit)]
    [InlineData(HttpStatusCode.BadRequest, StatusCodes.Status400BadRequest, WebAnalyticsProblemCodes.InvalidQuery)]
    [InlineData(HttpStatusCode.ServiceUnavailable, StatusCodes.Status502BadGateway, WebAnalyticsProblemCodes.UpstreamUnavailable)]
    public void Maps_vercel_failures_to_stable_problem_codes(
        HttpStatusCode upstreamStatus,
        int expectedStatus,
        string expectedCode)
    {
        var problem = Assert.IsType<WebAnalyticsProblemDefinition>(
            WebAnalyticsProblemFactory.FromException(new AnalyticsProviderApiException(upstreamStatus, AnalyticsProvider.Vercel)));

        Assert.Equal(expectedStatus, problem.Status);
        Assert.Equal(expectedCode, problem.Code);
    }

    [Fact]
    public void Maps_plausible_not_found_to_invalid_query()
    {
        var problem = Assert.IsType<WebAnalyticsProblemDefinition>(
            WebAnalyticsProblemFactory.FromException(new AnalyticsProviderApiException(
                HttpStatusCode.NotFound,
                AnalyticsProvider.Plausible)));

        Assert.Equal(StatusCodes.Status400BadRequest, problem.Status);
        Assert.Equal(WebAnalyticsProblemCodes.InvalidQuery, problem.Code);
    }

    [Fact]
    public void Maps_transport_timeout_and_payload_failures()
    {
        Assert.Equal(
            WebAnalyticsProblemCodes.UpstreamTransport,
            WebAnalyticsProblemFactory.FromException(new HttpRequestException())?.Code);
        Assert.Equal(
            WebAnalyticsProblemCodes.UpstreamTimeout,
            WebAnalyticsProblemFactory.FromException(new TaskCanceledException())?.Code);
        Assert.Equal(
            WebAnalyticsProblemCodes.InvalidUpstreamPayload,
            WebAnalyticsProblemFactory.FromException(new JsonException())?.Code);
    }

    [Fact]
    public void Maps_report_capacity_failures_to_service_unavailable()
    {
        var problem = Assert.IsType<WebAnalyticsProblemDefinition>(
            WebAnalyticsProblemFactory.FromException(new AnalyticsReportCapacityException()));

        Assert.Equal(StatusCodes.Status503ServiceUnavailable, problem.Status);
        Assert.Equal(WebAnalyticsProblemCodes.ReportCapacity, problem.Code);
    }

    [Fact]
    public void Returns_a_typed_problem_details_contract()
    {
        var result = WebAnalyticsProblemFactory.CreateResult(
            StatusCodes.Status400BadRequest,
            WebAnalyticsProblemCodes.InvalidQuery,
            "Invalid analytics query.");

        var details = Assert.IsType<AnalyticsProblemDetails>(result.Value);
        Assert.Equal(WebAnalyticsProblemCodes.InvalidQuery, details.Code);
    }

    [Fact]
    public void Exception_filter_maps_transport_failures_at_the_controller_boundary()
    {
        var context = CreateExceptionContext(new HttpRequestException());

        new WebAnalyticsExceptionFilter().OnException(context);

        AssertProblem(context, StatusCodes.Status502BadGateway, WebAnalyticsProblemCodes.UpstreamTransport);
    }

    [Fact]
    public void Exception_filter_maps_invalid_json_at_the_controller_boundary()
    {
        var context = CreateExceptionContext(new JsonException());

        new WebAnalyticsExceptionFilter().OnException(context);

        AssertProblem(context, StatusCodes.Status502BadGateway, WebAnalyticsProblemCodes.InvalidUpstreamPayload);
    }

    private static ExceptionContext CreateExceptionContext(Exception exception)
    {
        var actionContext = new ActionContext(
            new DefaultHttpContext(),
            new RouteData(),
            new ActionDescriptor());
        return new ExceptionContext(actionContext, []) { Exception = exception };
    }

    private static void AssertProblem(ExceptionContext context, int status, string code)
    {
        Assert.True(context.ExceptionHandled);
        var result = Assert.IsType<ObjectResult>(context.Result);
        Assert.Equal(status, result.StatusCode);
        var details = Assert.IsType<AnalyticsProblemDetails>(result.Value);
        Assert.Equal(code, details.Code);
    }
}

using System.Net;
using System.Text;
using System.Text.Json;
using TheBuilder.WebAnalytics.Configuration;
using TheBuilder.WebAnalytics.Models;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Tests.Services;

public sealed class PlausibleAnalyticsClientTests
{
    [Fact]
    public async Task Count_posts_authenticated_v2_query_with_exclusive_end_adjusted()
    {
        var handler = new RecordingHandler("""{"results":[{"dimensions":[],"metrics":[42,31]}]}""");
        var client = CreateClient(handler);

        var result = await client.CountAsync(CreateConnection(), CreateQuery(), CancellationToken.None);

        Assert.Equal(new AnalyticsTotals(42, 31), result);
        Assert.Equal(HttpMethod.Post, handler.Request?.Method);
        Assert.Equal("Bearer secret", handler.Request?.Headers.Authorization?.ToString());
        using var body = JsonDocument.Parse(handler.Body!);
        Assert.Equal("example.com", body.RootElement.GetProperty("site_id").GetString());
        Assert.Equal("2026-07-02T23:59:59.9999999+00:00", body.RootElement.GetProperty("date_range")[1].GetString());
    }

    [Fact]
    public async Task Breakdown_maps_common_dimension_filters_and_search()
    {
        var handler = new RecordingHandler("""{"results":[{"dimensions":["Google"],"metrics":[12,8]}]}""");
        var client = CreateClient(handler);
        var query = CreateQuery() with
        {
            RequestPath = "/news",
            Filters = [new AnalyticsFilter(AnalyticsDimension.Country, "Denmark")]
        };

        var rows = await client.GetBreakdownAsync(
            CreateConnection(), query, AnalyticsDimension.ReferrerHostname, 10, "goo", CancellationToken.None);

        Assert.Equal(new AnalyticsBreakdownRow("Google", 12, 8), Assert.Single(rows));
        Assert.Contains("visit:referrer", handler.Body);
        Assert.Contains("visit:country_name", handler.Body);
        Assert.Contains("event:page", handler.Body);
        Assert.Contains("contains", handler.Body);
    }

    [Fact]
    public async Task Events_map_plausible_goals()
    {
        var handler = new RecordingHandler("""{"results":[{"dimensions":["Signup"],"metrics":[9,7]}]}""");
        var client = CreateClient(handler);

        var rows = await client.GetEventsAsync(CreateConnection(), CreateQuery(), 20, null, CancellationToken.None);

        Assert.Equal(new AnalyticsEventRow("Signup", 9, 7), Assert.Single(rows));
        Assert.Contains("event:goal", handler.Body);
        Assert.Contains("events", handler.Body);
    }

    [Fact]
    public async Task Rate_limit_preserves_provider_identity_without_exposing_token()
    {
        var client = CreateClient(new RecordingHandler("{}", HttpStatusCode.TooManyRequests));

        var exception = await Assert.ThrowsAsync<AnalyticsProviderApiException>(() =>
            client.CountAsync(CreateConnection(), CreateQuery(), CancellationToken.None));

        Assert.Equal(AnalyticsProvider.Plausible, exception.Provider);
        Assert.Equal(HttpStatusCode.TooManyRequests, exception.StatusCode);
        Assert.DoesNotContain("secret", exception.ToString());
    }

    [Fact]
    public async Task Missing_results_are_rejected_as_an_untrusted_payload()
    {
        var client = CreateClient(new RecordingHandler("{}"));

        await Assert.ThrowsAsync<JsonException>(() =>
            client.CountAsync(CreateConnection(), CreateQuery(), CancellationToken.None));
    }

    [Theory]
    [InlineData(AnalyticsDimension.RequestPath, "event:page")]
    [InlineData(AnalyticsDimension.UtmCampaign, "visit:utm_campaign")]
    [InlineData(AnalyticsDimension.BrowserName, "visit:browser")]
    public void Dimensions_are_mapped_to_plausible(AnalyticsDimension dimension, string expected) =>
        Assert.Equal(expected, PlausibleAnalyticsClient.ToApiDimension(dimension));

    private static PlausibleAnalyticsClient CreateClient(HttpMessageHandler handler) =>
        new(new HttpClient(handler) { BaseAddress = new Uri("https://plausible.io/") }, new AnalyticsProviderRequestGate());

    private static AnalyticsConnection CreateConnection() => new(
        Guid.Parse("11111111-1111-1111-1111-111111111110"),
        "Plausible",
        AnalyticsProvider.Plausible,
        "secret",
        string.Empty,
        null,
        "example.com",
        [],
        false,
        new HashSet<Guid>(),
        new HashSet<string>());

    private static AnalyticsQuery CreateQuery() => new(
        Guid.Parse("11111111-1111-1111-1111-111111111110"),
        new DateTimeOffset(2026, 7, 1, 0, 0, 0, TimeSpan.Zero),
        new DateTimeOffset(2026, 7, 3, 0, 0, 0, TimeSpan.Zero),
        AnalyticsInterval.Day);

    private sealed class RecordingHandler(string body, HttpStatusCode statusCode = HttpStatusCode.OK) : HttpMessageHandler
    {
        public HttpRequestMessage? Request { get; private set; }
        public string? Body { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Request = request;
            Body = request.Content is null ? null : await request.Content.ReadAsStringAsync(cancellationToken);
            return new HttpResponseMessage(statusCode)
            {
                Content = new StringContent(body, Encoding.UTF8, "application/json")
            };
        }
    }
}

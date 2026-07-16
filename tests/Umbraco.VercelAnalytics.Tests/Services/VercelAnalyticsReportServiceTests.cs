using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Models;
using Umbraco.VercelAnalytics.Services;

namespace Umbraco.VercelAnalytics.Tests.Services;

public sealed class VercelAnalyticsReportServiceTests
{
    [Fact]
    public async Task Summary_is_cached_by_normalized_query()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);
        var query = CreateQuery();

        var first = await service.GetSummaryAsync(query, CancellationToken.None);
        var second = await service.GetSummaryAsync(query with { Connection = "MAIN" }, CancellationToken.None);

        Assert.NotNull(first);
        Assert.Same(first, second);
        Assert.Equal(2, client.CountCalls);
        Assert.Equal(1, client.TrendCalls);
    }

    [Fact]
    public async Task Summary_compares_with_the_immediately_preceding_range()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);

        var summary = await service.GetSummaryAsync(CreateQuery(), CancellationToken.None);

        Assert.NotNull(summary);
        Assert.Contains(client.CountQueries, query =>
            query.From == new DateOnly(2026, 6, 16) &&
            query.To == new DateOnly(2026, 6, 30));
        Assert.NotNull(summary.PreviousTotals);
    }

    [Fact]
    public async Task Summary_remains_available_when_the_previous_range_is_unavailable()
    {
        var client = new CountingClient { FailPreviousCount = true };
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);

        var summary = await service.GetSummaryAsync(CreateQuery(), CancellationToken.None);

        Assert.NotNull(summary);
        Assert.Null(summary.PreviousTotals);
        Assert.Equal(new AnalyticsTotals(20, 10), summary.Totals);
    }

    [Fact]
    public async Task Breakdown_cache_separates_dimensions()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);

        await service.GetBreakdownAsync(CreateQuery(), AnalyticsDimension.Country, 10, null, CancellationToken.None);
        await service.GetBreakdownAsync(CreateQuery(), AnalyticsDimension.DeviceType, 10, null, CancellationToken.None);

        Assert.Equal(2, client.BreakdownCalls);
    }

    [Fact]
    public async Task Breakdown_cache_separates_search_terms()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);

        await service.GetBreakdownAsync(CreateQuery(), AnalyticsDimension.RequestPath, 100, "news", CancellationToken.None);
        await service.GetBreakdownAsync(CreateQuery(), AnalyticsDimension.RequestPath, 100, "about", CancellationToken.None);

        Assert.Equal(2, client.BreakdownCalls);
    }

    [Fact]
    public async Task Summary_cache_separates_filter_values()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);

        await service.GetSummaryAsync(CreateQuery() with
        {
            Filters = [new AnalyticsFilter(AnalyticsDimension.Country, "DK")]
        }, CancellationToken.None);
        await service.GetSummaryAsync(CreateQuery() with
        {
            Filters = [new AnalyticsFilter(AnalyticsDimension.Country, "US")]
        }, CancellationToken.None);

        Assert.Equal(4, client.CountCalls);
        Assert.Equal(2, client.TrendCalls);
    }

    [Fact]
    public async Task Events_are_cached_by_search_and_document_scope()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);
        var query = CreateQuery() with { RequestPath = "/news" };

        await service.GetEventsAsync(query, 100, "signup", CancellationToken.None);
        await service.GetEventsAsync(query, 100, "signup", CancellationToken.None);
        await service.GetEventsAsync(query, 100, "purchase", CancellationToken.None);

        Assert.Equal(2, client.EventCalls);
    }

    [Fact]
    public async Task Event_details_combine_totals_and_property_values_and_are_cached_by_name()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);

        var first = await service.GetEventDetailsAsync(CreateQuery(), "Signup", null, CancellationToken.None);
        var second = await service.GetEventDetailsAsync(CreateQuery(), "Signup", null, CancellationToken.None);

        Assert.NotNull(first);
        Assert.Same(first, second);
        Assert.Equal(new AnalyticsEventTotals(30, 12), first.Totals);
        Assert.Equal("plan", Assert.Single(first.Properties).Name);
        Assert.Equal(1, client.EventCountCalls);
        Assert.Equal(1, client.EventPropertyNameCalls);
        Assert.Equal(1, client.EventPropertyValueCalls);
    }

    [Fact]
    public async Task Event_details_cache_and_queries_include_the_event_data_filter()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);
        var filter = new AnalyticsEventDataFilter("plan", "Enterprise");

        await service.GetEventDetailsAsync(CreateQuery(), "Signup", filter, CancellationToken.None);
        await service.GetEventDetailsAsync(CreateQuery(), "Signup", filter, CancellationToken.None);
        await service.GetEventDetailsAsync(CreateQuery(), "Signup", new("plan", "Pro"), CancellationToken.None);

        Assert.Equal(2, client.EventCountCalls);
        Assert.Equal(new AnalyticsEventDataFilter("plan", "Pro"), client.LastEventDataFilter);
    }

    [Fact]
    public async Task Cancellation_is_forwarded_to_the_Vercel_client()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);
        using var cancellation = new CancellationTokenSource();
        cancellation.Cancel();

        await Assert.ThrowsAnyAsync<OperationCanceledException>(() =>
            service.GetSummaryAsync(CreateQuery(), cancellation.Token));
    }

    private static AnalyticsQuery CreateQuery() => new(
        "main",
        new DateOnly(2026, 7, 1),
        new DateOnly(2026, 7, 15),
        AnalyticsInterval.Day);

    private static VercelAnalyticsConnectionRegistry CreateRegistry() => new(Options.Create(new VercelAnalyticsOptions
    {
        Enabled = true,
        DefaultConnection = "main",
        Connections = new Dictionary<string, VercelAnalyticsConnectionOptions>(StringComparer.OrdinalIgnoreCase)
        {
            ["main"] = new()
            {
                DisplayName = "Main",
                AccessToken = "secret",
                ProjectId = "project",
                Hostnames = ["example.com"],
                EnabledDocumentTypes = ["articlePage"]
            }
        }
    }));

    private sealed class CountingClient : IVercelAnalyticsClient
    {
        public int CountCalls { get; private set; }
        public int TrendCalls { get; private set; }
        public int BreakdownCalls { get; private set; }
        public int EventCalls { get; private set; }
        public int EventCountCalls { get; private set; }
        public int EventPropertyNameCalls { get; private set; }
        public int EventPropertyValueCalls { get; private set; }
        public AnalyticsEventDataFilter? LastEventDataFilter { get; private set; }
        public bool FailPreviousCount { get; init; }
        public List<AnalyticsQuery> CountQueries { get; } = [];

        public Task<AnalyticsTotals> CountAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            CountCalls++;
            CountQueries.Add(query);
            if (FailPreviousCount && query.To < new DateOnly(2026, 7, 1))
            {
                throw new VercelAnalyticsApiException(System.Net.HttpStatusCode.PaymentRequired);
            }
            return Task.FromResult(new AnalyticsTotals(20, 10));
        }

        public Task<IReadOnlyList<AnalyticsPoint>> GetTrendAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            TrendCalls++;
            return Task.FromResult<IReadOnlyList<AnalyticsPoint>>([]);
        }

        public Task<IReadOnlyList<AnalyticsBreakdownRow>> GetBreakdownAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, AnalyticsDimension dimension, int limit, string? search, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            BreakdownCalls++;
            return Task.FromResult<IReadOnlyList<AnalyticsBreakdownRow>>([]);
        }

        public Task<AnalyticsEventTotals> CountEventsAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, string eventName, AnalyticsEventDataFilter? eventDataFilter, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            EventCountCalls++;
            LastEventDataFilter = eventDataFilter;
            return Task.FromResult(new AnalyticsEventTotals(30, 12));
        }

        public Task<IReadOnlyList<AnalyticsEventRow>> GetEventsAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, int limit, string? search, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            EventCalls++;
            return Task.FromResult<IReadOnlyList<AnalyticsEventRow>>([]);
        }

        public Task<IReadOnlyList<string>> GetEventPropertyNamesAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, string eventName, AnalyticsEventDataFilter? eventDataFilter, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            EventPropertyNameCalls++;
            return Task.FromResult<IReadOnlyList<string>>(["plan"]);
        }

        public Task<IReadOnlyList<AnalyticsEventPropertyValue>> GetEventPropertyValuesAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, string eventName, string propertyName, int limit, AnalyticsEventDataFilter? eventDataFilter, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            EventPropertyValueCalls++;
            return Task.FromResult<IReadOnlyList<AnalyticsEventPropertyValue>>([new("Pro", 20, 10)]);
        }
    }
}

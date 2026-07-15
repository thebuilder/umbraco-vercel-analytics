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
        Assert.Equal(1, client.CountCalls);
        Assert.Equal(1, client.TrendCalls);
    }

    [Fact]
    public async Task Breakdown_cache_separates_dimensions()
    {
        var client = new CountingClient();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new VercelAnalyticsReportService(CreateRegistry(), client, cache);

        await service.GetBreakdownAsync(CreateQuery(), AnalyticsDimension.Country, 10, CancellationToken.None);
        await service.GetBreakdownAsync(CreateQuery(), AnalyticsDimension.DeviceType, 10, CancellationToken.None);

        Assert.Equal(2, client.BreakdownCalls);
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

        public Task<AnalyticsTotals> CountAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            CountCalls++;
            return Task.FromResult(new AnalyticsTotals(20, 10));
        }

        public Task<IReadOnlyList<AnalyticsPoint>> GetTrendAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            TrendCalls++;
            return Task.FromResult<IReadOnlyList<AnalyticsPoint>>([]);
        }

        public Task<IReadOnlyList<AnalyticsBreakdownRow>> GetBreakdownAsync(VercelAnalyticsConnection connection, AnalyticsQuery query, AnalyticsDimension dimension, int limit, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            BreakdownCalls++;
            return Task.FromResult<IReadOnlyList<AnalyticsBreakdownRow>>([]);
        }
    }
}

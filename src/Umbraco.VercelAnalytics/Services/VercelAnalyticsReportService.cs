using Microsoft.Extensions.Caching.Memory;
using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Models;

namespace Umbraco.VercelAnalytics.Services;

public sealed class VercelAnalyticsReportService(
    VercelAnalyticsConnectionRegistry registry,
    IVercelAnalyticsClient client,
    IMemoryCache cache)
{
    public async Task<AnalyticsSummary?> GetSummaryAsync(
        AnalyticsQuery query,
        CancellationToken cancellationToken)
    {
        var connection = registry.Get(query.Connection);
        if (connection is null || !connection.IsConfigured) return null;
        var cacheKey = $"vercel-analytics:{registry.SettingsRevision}:summary:{Normalize(query)}";
        return await cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = registry.Settings.CacheDuration;
            var totals = client.CountAsync(connection, query, cancellationToken);
            var previousTotals = TryGetPreviousTotalsAsync(connection, query, cancellationToken);
            var trend = client.GetTrendAsync(connection, query, cancellationToken);
            await Task.WhenAll(totals, previousTotals, trend);
            return new AnalyticsSummary(await totals, await previousTotals, await trend);
        });
    }

    public async Task<AnalyticsBreakdown?> GetBreakdownAsync(
        AnalyticsQuery query,
        AnalyticsDimension dimension,
        int limit,
        string? search,
        CancellationToken cancellationToken)
    {
        var connection = registry.Get(query.Connection);
        if (connection is null || !connection.IsConfigured) return null;
        var normalizedSearch = search?.Trim();
        var cacheKey = $"vercel-analytics:{registry.SettingsRevision}:breakdown:{dimension}:{limit}:{normalizedSearch}:{Normalize(query)}";
        return await cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = registry.Settings.CacheDuration;
            var rows = await client.GetBreakdownAsync(connection, query, dimension, limit, normalizedSearch, cancellationToken);
            return new AnalyticsBreakdown(dimension, rows);
        });
    }

    public async Task<AnalyticsEventsReport?> GetEventsAsync(
        AnalyticsQuery query,
        int limit,
        string? search,
        CancellationToken cancellationToken)
    {
        var connection = registry.Get(query.Connection);
        if (connection is null || !connection.IsConfigured) return null;
        var normalizedSearch = search?.Trim();
        var cacheKey = $"vercel-analytics:{registry.SettingsRevision}:events:{limit}:{normalizedSearch}:{Normalize(query)}";
        return await cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = registry.Settings.CacheDuration;
            var rows = await client.GetEventsAsync(connection, query, limit, normalizedSearch, cancellationToken);
            return new AnalyticsEventsReport(rows);
        });
    }

    public async Task<AnalyticsEventDetails?> GetEventDetailsAsync(
        AnalyticsQuery query,
        string eventName,
        AnalyticsEventDataFilter? eventDataFilter,
        CancellationToken cancellationToken)
    {
        var connection = registry.Get(query.Connection);
        if (connection is null || !connection.IsConfigured) return null;
        var normalizedEventName = eventName.Trim();
        var eventDataCacheKey = eventDataFilter is null
            ? string.Empty
            : $":{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(eventDataFilter.Property))}:{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(eventDataFilter.Value))}";
        var cacheKey = $"vercel-analytics:{registry.SettingsRevision}:event-details:{normalizedEventName}{eventDataCacheKey}:{Normalize(query)}";
        return await cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = registry.Settings.CacheDuration;
            var totals = client.CountEventsAsync(connection, query, normalizedEventName, eventDataFilter, cancellationToken);
            var propertyNamesTask = client.GetEventPropertyNamesAsync(connection, query, normalizedEventName, eventDataFilter, cancellationToken);
            await Task.WhenAll(totals, propertyNamesTask);
            var propertyNames = await propertyNamesTask;
            var propertyTasks = propertyNames.Select(async propertyName => new AnalyticsEventProperty(
                propertyName,
                await client.GetEventPropertyValuesAsync(connection, query, normalizedEventName, propertyName, 100, eventDataFilter, cancellationToken)));
            var properties = await Task.WhenAll(propertyTasks);
            return new AnalyticsEventDetails(normalizedEventName, await totals, properties);
        });
    }

    private static string Normalize(AnalyticsQuery query)
    {
        var filters = string.Join(",", (query.Filters ?? [])
            .OrderBy(filter => filter.Dimension)
            .Select(filter => $"{filter.Dimension}:{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(filter.Value))}"));
        return $"{query.Connection.ToLowerInvariant()}:{query.From:yyyyMMdd}:{query.To:yyyyMMdd}:{query.Interval}:{query.RequestPath}:{filters}";
    }

    private async Task<AnalyticsTotals?> TryGetPreviousTotalsAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        CancellationToken cancellationToken)
    {
        var inclusiveDays = query.To.DayNumber - query.From.DayNumber + 1;
        var previousQuery = query with
        {
            From = query.From.AddDays(-inclusiveDays),
            To = query.From.AddDays(-1)
        };

        try
        {
            return await client.CountAsync(connection, previousQuery, cancellationToken);
        }
        catch (VercelAnalyticsApiException)
        {
            return null;
        }
    }
}

using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Models;

namespace Umbraco.VercelAnalytics.Services;

public interface IVercelAnalyticsClient
{
    Task<AnalyticsTotals> CountAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<AnalyticsPoint>> GetTrendAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<AnalyticsBreakdownRow>> GetBreakdownAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        AnalyticsDimension dimension,
        int limit,
        string? search,
        CancellationToken cancellationToken);

    Task<AnalyticsEventTotals> CountEventsAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        string eventName,
        AnalyticsEventDataFilter? eventDataFilter,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<AnalyticsEventRow>> GetEventsAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        int limit,
        string? search,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<string>> GetEventPropertyNamesAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        string eventName,
        AnalyticsEventDataFilter? eventDataFilter,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<AnalyticsEventPropertyValue>> GetEventPropertyValuesAsync(
        VercelAnalyticsConnection connection,
        AnalyticsQuery query,
        string eventName,
        string propertyName,
        int limit,
        AnalyticsEventDataFilter? eventDataFilter,
        CancellationToken cancellationToken);
}

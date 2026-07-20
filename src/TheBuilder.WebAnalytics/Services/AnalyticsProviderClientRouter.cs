using TheBuilder.WebAnalytics.Configuration;
using TheBuilder.WebAnalytics.Models;

namespace TheBuilder.WebAnalytics.Services;

public sealed class AnalyticsProviderClientRouter(
    VercelAnalyticsClient vercelClient,
    MockAnalyticsClient mockClient,
    PlausibleAnalyticsClient? plausibleClient = null) : IAnalyticsProviderClient
{
    public Task<string> GetDisplayNameAsync(AnalyticsConnection connection, CancellationToken cancellationToken) =>
        ClientFor(connection).GetDisplayNameAsync(connection, cancellationToken);

    public Task<AnalyticsTotals> CountAsync(AnalyticsConnection connection, AnalyticsQuery query, CancellationToken cancellationToken) =>
        ClientFor(connection).CountAsync(connection, query, cancellationToken);

    public Task<long> GetPageViewTotalAsync(AnalyticsConnection connection, AnalyticsQuery query, CancellationToken cancellationToken) =>
        ClientFor(connection).GetPageViewTotalAsync(connection, query, cancellationToken);

    public Task<IReadOnlyList<AnalyticsPoint>> GetTrendAsync(AnalyticsConnection connection, AnalyticsQuery query, CancellationToken cancellationToken) =>
        ClientFor(connection).GetTrendAsync(connection, query, cancellationToken);

    public Task<IReadOnlyList<AnalyticsBreakdownRow>> GetBreakdownAsync(
        AnalyticsConnection connection,
        AnalyticsQuery query,
        AnalyticsDimension dimension,
        int limit,
        string? search,
        CancellationToken cancellationToken) =>
        ClientFor(connection).GetBreakdownAsync(connection, query, dimension, limit, search, cancellationToken);

    public Task<AnalyticsEventTotals> CountEventsAsync(
        AnalyticsConnection connection,
        AnalyticsQuery query,
        string eventName,
        AnalyticsEventDataFilter? eventDataFilter,
        CancellationToken cancellationToken) =>
        ClientFor(connection).CountEventsAsync(connection, query, eventName, eventDataFilter, cancellationToken);

    public Task<IReadOnlyList<AnalyticsEventRow>> GetEventsAsync(
        AnalyticsConnection connection,
        AnalyticsQuery query,
        int limit,
        string? search,
        CancellationToken cancellationToken) =>
        ClientFor(connection).GetEventsAsync(connection, query, limit, search, cancellationToken);

    public Task<IReadOnlyList<AnalyticsFlagRow>> GetFlagsAsync(
        AnalyticsConnection connection,
        AnalyticsQuery query,
        string? flagKey,
        int limit,
        CancellationToken cancellationToken) =>
        ClientFor(connection).GetFlagsAsync(connection, query, flagKey, limit, cancellationToken);

    public Task<IReadOnlyList<string>> GetEventPropertyNamesAsync(
        AnalyticsConnection connection,
        AnalyticsQuery query,
        string eventName,
        AnalyticsEventDataFilter? eventDataFilter,
        CancellationToken cancellationToken) =>
        ClientFor(connection).GetEventPropertyNamesAsync(connection, query, eventName, eventDataFilter, cancellationToken);

    public Task<IReadOnlyList<AnalyticsEventPropertyValue>> GetEventPropertyValuesAsync(
        AnalyticsConnection connection,
        AnalyticsQuery query,
        string eventName,
        string propertyName,
        int limit,
        string? search,
        AnalyticsEventDataFilter? eventDataFilter,
        CancellationToken cancellationToken) =>
        ClientFor(connection).GetEventPropertyValuesAsync(
            connection,
            query,
            eventName,
            propertyName,
            limit,
            search,
            eventDataFilter,
            cancellationToken);

    private IAnalyticsProviderClient ClientFor(AnalyticsConnection connection) =>
        connection.IsMock
            ? mockClient
            : connection.Provider switch
            {
                AnalyticsProvider.Plausible => plausibleClient ?? throw new InvalidOperationException("Plausible Analytics is not registered."),
                _ => vercelClient
            };
}

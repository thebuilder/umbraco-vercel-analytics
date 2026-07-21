using TheBuilder.WebAnalytics.Models;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Configuration;

internal static class AnalyticsProviderCapabilities
{
    internal static AnalyticsCapabilities FromClient<TClient>(
        IReadOnlyList<AnalyticsDimension> dimensions,
        bool globalEventFiltering,
        bool breakdownOrdering)
        where TClient : class, IAnalyticsProviderClient
    {
        var clientType = typeof(TClient);
        var events = typeof(IAnalyticsEventsProviderClient).IsAssignableFrom(clientType);
        var eventDetails = typeof(IAnalyticsEventDetailsProviderClient).IsAssignableFrom(clientType);
        var eventProperties = typeof(IAnalyticsEventPropertiesProviderClient).IsAssignableFrom(clientType);
        var flags = typeof(IAnalyticsFlagsProviderClient).IsAssignableFrom(clientType);

        if (globalEventFiltering && !events)
            throw new InvalidOperationException(
                $"{clientType.Name} cannot enable global event filtering without implementing {nameof(IAnalyticsEventsProviderClient)}.");

        return new(
            dimensions,
            events,
            eventDetails,
            eventProperties,
            globalEventFiltering,
            flags,
            breakdownOrdering);
    }
}

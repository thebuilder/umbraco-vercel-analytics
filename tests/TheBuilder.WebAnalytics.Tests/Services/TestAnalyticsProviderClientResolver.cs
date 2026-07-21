using TheBuilder.WebAnalytics.Configuration;

namespace TheBuilder.WebAnalytics.Services;

internal sealed class TestAnalyticsProviderClientResolver(IAnalyticsProviderClient client)
    : IAnalyticsProviderClientResolver
{
    public IAnalyticsProviderClient Get(AnalyticsConnection _) => client;
}

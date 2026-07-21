using TheBuilder.WebAnalytics.Configuration;

namespace TheBuilder.WebAnalytics.Services;

internal sealed class TestAnalyticsProviderClientResolver(IAnalyticsProviderClient client)
    : IAnalyticsProviderClientResolver
{
    public IAnalyticsProviderClient Get(AnalyticsConnection _) => client;

    public TCapability Get<TCapability>(AnalyticsConnection _)
        where TCapability : class =>
        client as TCapability
        ?? throw new InvalidOperationException($"Test client does not support {typeof(TCapability).Name}.");
}

using Microsoft.Extensions.DependencyInjection;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Configuration;

internal static class AnalyticsProviderServiceCollectionExtensions
{
    internal static IServiceCollection AddAnalyticsProvider<TClient>(
        this IServiceCollection services,
        AnalyticsProviderDefinition definition,
        Uri baseAddress)
        where TClient : class, IAnalyticsProviderClient
    {
        services.AddHttpClient<TClient>(client =>
        {
            client.BaseAddress = baseAddress;
            client.Timeout = TimeSpan.FromSeconds(15);
        });
        services.AddTransient<IAnalyticsProviderClient>(serviceProvider =>
        {
            var client = serviceProvider.GetRequiredService<TClient>();
            if (client.Definition != definition)
                throw new InvalidOperationException($"The registered analytics client does not use the {definition.Provider} provider definition.");
            return client;
        });
        return services;
    }
}

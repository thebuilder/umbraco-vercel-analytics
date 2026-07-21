using Microsoft.Extensions.DependencyInjection;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Configuration;

internal static class AnalyticsProviderServiceCollectionExtensions
{
    internal static IServiceCollection AddAnalyticsProvider<TClient>(
        this IServiceCollection services,
        Uri baseAddress)
        where TClient : class, IAnalyticsProviderClient
    {
        services.AddHttpClient<TClient>(client =>
        {
            client.BaseAddress = baseAddress;
            client.Timeout = TimeSpan.FromSeconds(15);
        });
        services.AddTransient<IAnalyticsProviderClient>(serviceProvider =>
            serviceProvider.GetRequiredService<TClient>());
        return services;
    }
}

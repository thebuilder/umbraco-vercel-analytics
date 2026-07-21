using TheBuilder.WebAnalytics.Configuration;
using TheBuilder.WebAnalytics.Models;

namespace TheBuilder.WebAnalytics.Services;

public sealed class AnalyticsProviderClientResolver(
    IEnumerable<IAnalyticsProviderClient> providerClients,
    MockAnalyticsClient mockClient) : IAnalyticsProviderClientResolver
{
    private readonly IReadOnlyDictionary<AnalyticsProvider, IAnalyticsProviderClient> _providerClients =
        BuildProviderClients(providerClients);

    public IAnalyticsProviderClient Get(AnalyticsConnection connection) =>
        connection.IsMock
            ? mockClient
            : _providerClients.TryGetValue(connection.Provider, out var client)
                ? client
                : throw new ArgumentOutOfRangeException(nameof(connection), connection.Provider, "Unsupported analytics provider.");

    public TCapability Get<TCapability>(AnalyticsConnection connection)
        where TCapability : class =>
        Get(connection) as TCapability
        ?? throw new InvalidOperationException(
            $"The {connection.Provider} analytics client does not support {typeof(TCapability).Name}.");

    private static IReadOnlyDictionary<AnalyticsProvider, IAnalyticsProviderClient> BuildProviderClients(
        IEnumerable<IAnalyticsProviderClient> clients)
    {
        var clientList = clients.ToArray();
        var duplicates = clientList.GroupBy(client => client.Definition.Provider).FirstOrDefault(group => group.Count() > 1);
        if (duplicates is not null)
            throw new InvalidOperationException($"Multiple analytics clients are registered for {duplicates.Key}.");

        var byProvider = clientList.ToDictionary(client => client.Definition.Provider);
        foreach (var definition in AnalyticsProviderCatalog.Default.Definitions)
        {
            if (!byProvider.ContainsKey(definition.Provider))
                throw new InvalidOperationException($"No analytics client is registered for {definition.Provider}.");
        }
        return byProvider;
    }
}

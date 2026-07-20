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

    private static IReadOnlyDictionary<AnalyticsProvider, IAnalyticsProviderClient> BuildProviderClients(
        IEnumerable<IAnalyticsProviderClient> clients)
    {
        var clientList = clients.ToArray();
        var duplicates = clientList.GroupBy(client => client.Provider).FirstOrDefault(group => group.Count() > 1);
        if (duplicates is not null)
            throw new InvalidOperationException($"Multiple analytics clients are registered for {duplicates.Key}.");

        var byProvider = clientList.ToDictionary(client => client.Provider);
        foreach (var definition in AnalyticsProviderCatalog.Default.Definitions)
        {
            if (!byProvider.TryGetValue(definition.Provider, out var client))
                throw new InvalidOperationException($"No analytics client is registered for {definition.Provider}.");
            ValidateOptionalCapabilities(definition, client);
        }
        return byProvider;
    }

    private static void ValidateOptionalCapabilities(
        AnalyticsProviderDefinition definition,
        IAnalyticsProviderClient client)
    {
        Validate(definition.Capabilities.Events, client is IAnalyticsEventsProviderClient, "events");
        Validate(definition.Capabilities.EventProperties, client is IAnalyticsEventPropertiesProviderClient, "event properties");
        Validate(definition.Capabilities.Flags, client is IAnalyticsFlagsProviderClient, "flags");

        void Validate(bool advertised, bool implemented, string capability)
        {
            if (advertised != implemented)
                throw new InvalidOperationException($"{definition.Provider} client and catalog disagree about {capability} support.");
        }
    }
}

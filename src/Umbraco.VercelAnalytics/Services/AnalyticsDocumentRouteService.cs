using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Models;

namespace Umbraco.VercelAnalytics.Services;

public interface IAnalyticsDocumentRouteService
{
    Task<string?> GetConnectionBaseUrlAsync(
        VercelAnalyticsConnection connection,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<AnalyticsDocumentRoute>> GetRoutesAsync(
        Guid documentId,
        string? currentCulture,
        CancellationToken cancellationToken);
}

public sealed class AnalyticsDocumentRouteService(
    IContentService contentService,
    IAnalyticsPublishedContentAccessor publishedContent,
    VercelAnalyticsConnectionRegistry registry) : IAnalyticsDocumentRouteService
{
    public async Task<string?> GetConnectionBaseUrlAsync(
        VercelAnalyticsConnection connection,
        CancellationToken cancellationToken)
    {
        var configuredHostname = connection.Hostnames.Order(StringComparer.OrdinalIgnoreCase).FirstOrDefault();
        if (configuredHostname is not null) return $"https://{configuredHostname}";

        foreach (var rootKey in connection.DocumentRootKeys)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var baseUrl = await publishedContent.GetBaseUrlAsync(rootKey, cancellationToken);
            if (baseUrl is not null) return baseUrl;
        }

        return null;
    }

    public async Task<IReadOnlyList<AnalyticsDocumentRoute>> GetRoutesAsync(
        Guid documentId,
        string? currentCulture,
        CancellationToken cancellationToken)
    {
        var content = contentService.GetById(documentId);
        if (content is null) return [];

        var rootConnection = FindRootConnection(content);
        var published = await publishedContent.GetDocumentAsync(documentId, cancellationToken);
        if (published is null) return [];

        var routes = new List<AnalyticsDocumentRoute>();
        foreach (var publishedRoute in published.Routes)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var hostnameConnection = registry.FindByHostname(publishedRoute.Hostname);
            var connection = rootConnection ?? hostnameConnection;
            if (connection is null ||
                !connection.IsDocumentTypeEnabled(published.ContentTypeAlias, published.ContentTypeKey)) continue;

            var warnings = new List<string>();
            if (rootConnection is not null && hostnameConnection is not null &&
                !string.Equals(rootConnection.Alias, hostnameConnection.Alias, StringComparison.OrdinalIgnoreCase))
            {
                warnings.Add($"Document root maps to '{rootConnection.Alias}', but hostname '{publishedRoute.Hostname}' maps to '{hostnameConnection.Alias}'. The document-root mapping is used.");
            }

            routes.Add(new AnalyticsDocumentRoute(
                connection.Alias,
                publishedRoute.Culture,
                publishedRoute.Hostname,
                publishedRoute.Path,
                publishedRoute.Url,
                string.Equals(publishedRoute.Culture, currentCulture, StringComparison.OrdinalIgnoreCase),
                warnings));
        }

        return routes;
    }

    private VercelAnalyticsConnection? FindRootConnection(IContent content)
    {
        var ancestorKeys = new List<Guid>();
        var current = content;
        while (current is not null)
        {
            ancestorKeys.Add(current.Key);
            current = current.ParentId > 0 ? contentService.GetById(current.ParentId) : null;
        }

        return registry.FindNearestRoot(ancestorKeys);
    }

}

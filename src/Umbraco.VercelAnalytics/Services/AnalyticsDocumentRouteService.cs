using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;
using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Models;

namespace Umbraco.VercelAnalytics.Services;

public sealed class AnalyticsDocumentRouteService(
    IContentService contentService,
    IUmbracoContextFactory umbracoContextFactory,
    IPublishedUrlProvider publishedUrlProvider,
    VercelAnalyticsConnectionRegistry registry)
{
    public async Task<string?> GetConnectionBaseUrlAsync(
        VercelAnalyticsConnection connection,
        CancellationToken cancellationToken)
    {
        var configuredHostname = connection.Hostnames.Order(StringComparer.OrdinalIgnoreCase).FirstOrDefault();
        if (configuredHostname is not null) return $"https://{configuredHostname}";

        using var contextReference = umbracoContextFactory.EnsureUmbracoContext();
        var publishedContent = contextReference.UmbracoContext.Content;
        if (publishedContent is null) return null;

        foreach (var rootKey in connection.DocumentRootKeys)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var root = await publishedContent.GetByIdAsync(rootKey);
            if (root is null) continue;

            var cultures = root.Cultures.Count == 0 ? [string.Empty] : root.Cultures.Keys;
            foreach (var culture in cultures)
            {
                var url = root.Url(publishedUrlProvider, NullIfEmpty(culture), UrlMode.Absolute);
                if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) ||
                    (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp)) continue;

                return uri.GetLeftPart(UriPartial.Authority);
            }
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

        var rootConnection = FindRootConnection(content.Id);
        using var contextReference = umbracoContextFactory.EnsureUmbracoContext();
        var published = contextReference.UmbracoContext.Content is null
            ? null
            : await contextReference.UmbracoContext.Content.GetByIdAsync(documentId);
        if (published is null) return [];

        var cultures = published.Cultures.Count == 0 ? [string.Empty] : published.Cultures.Keys;
        var routes = new List<AnalyticsDocumentRoute>();
        foreach (var culture in cultures)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var url = published.Url(publishedUrlProvider, NullIfEmpty(culture), UrlMode.Absolute);
            if (string.IsNullOrWhiteSpace(url) || url == "#") continue;

            var absolute = Uri.TryCreate(url, UriKind.Absolute, out var uri);
            var hostname = absolute ? uri!.Host : string.Empty;
            var path = absolute ? uri!.AbsolutePath : NormalizePath(url);
            var hostnameConnection = registry.FindByHostname(hostname);
            var connection = rootConnection ?? hostnameConnection;
            if (connection is null ||
                !connection.IsDocumentTypeEnabled(published.ContentType.Alias, published.ContentType.Key)) continue;

            var warnings = new List<string>();
            if (rootConnection is not null && hostnameConnection is not null &&
                !string.Equals(rootConnection.Alias, hostnameConnection.Alias, StringComparison.OrdinalIgnoreCase))
            {
                warnings.Add($"Document root maps to '{rootConnection.Alias}', but hostname '{hostname}' maps to '{hostnameConnection.Alias}'. The document-root mapping is used.");
            }

            routes.Add(new AnalyticsDocumentRoute(
                connection.Alias,
                culture,
                hostname,
                path,
                url,
                string.Equals(culture, currentCulture, StringComparison.OrdinalIgnoreCase),
                warnings));
        }

        return routes;
    }

    private VercelAnalyticsConnection? FindRootConnection(int contentId)
    {
        var ancestorKeys = new List<Guid>();
        var current = contentService.GetById(contentId);
        while (current is not null)
        {
            ancestorKeys.Add(current.Key);
            current = current.ParentId > 0 ? contentService.GetById(current.ParentId) : null;
        }

        return registry.FindNearestRoot(ancestorKeys);
    }

    private static string NormalizePath(string url)
    {
        var path = url.Split('?', '#')[0];
        return path.StartsWith('/') ? path : $"/{path}";
    }

    private static string? NullIfEmpty(string value) => value.Length == 0 ? null : value;
}

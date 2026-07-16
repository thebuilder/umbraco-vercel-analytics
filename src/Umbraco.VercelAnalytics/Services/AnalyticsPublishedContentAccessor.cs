using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;

namespace Umbraco.VercelAnalytics.Services;

public interface IAnalyticsPublishedContentAccessor
{
    Task<AnalyticsPublishedDocument?> GetDocumentAsync(Guid documentId, CancellationToken cancellationToken);

    Task<string?> GetBaseUrlAsync(Guid documentId, CancellationToken cancellationToken);
}

public sealed record AnalyticsPublishedDocument(
    string ContentTypeAlias,
    Guid ContentTypeKey,
    IReadOnlyList<AnalyticsPublishedRoute> Routes);

public sealed record AnalyticsPublishedRoute(
    string Culture,
    string Hostname,
    string Path,
    string Url);

public sealed class UmbracoAnalyticsPublishedContentAccessor(
    IUmbracoContextFactory umbracoContextFactory,
    IPublishedUrlProvider publishedUrlProvider) : IAnalyticsPublishedContentAccessor
{
    public async Task<AnalyticsPublishedDocument?> GetDocumentAsync(
        Guid documentId,
        CancellationToken cancellationToken)
    {
        using var contextReference = umbracoContextFactory.EnsureUmbracoContext();
        var publishedContent = contextReference.UmbracoContext.Content;
        if (publishedContent is null) return null;

        var content = await publishedContent.GetByIdAsync(documentId);
        if (content is null) return null;

        var routes = new List<AnalyticsPublishedRoute>();
        var cultures = content.Cultures.Count == 0 ? [string.Empty] : content.Cultures.Keys;
        foreach (var culture in cultures)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var url = content.Url(publishedUrlProvider, NullIfEmpty(culture), UrlMode.Absolute);
            if (string.IsNullOrWhiteSpace(url) || url == "#") continue;

            var absolute = Uri.TryCreate(url, UriKind.Absolute, out var uri);
            routes.Add(new AnalyticsPublishedRoute(
                culture,
                absolute ? uri!.Host : string.Empty,
                absolute ? uri!.AbsolutePath : NormalizePath(url),
                url));
        }

        return new AnalyticsPublishedDocument(content.ContentType.Alias, content.ContentType.Key, routes);
    }

    public async Task<string?> GetBaseUrlAsync(Guid documentId, CancellationToken cancellationToken)
    {
        using var contextReference = umbracoContextFactory.EnsureUmbracoContext();
        var publishedContent = contextReference.UmbracoContext.Content;
        if (publishedContent is null) return null;

        var content = await publishedContent.GetByIdAsync(documentId);
        if (content is null) return null;

        var cultures = content.Cultures.Count == 0 ? [string.Empty] : content.Cultures.Keys;
        foreach (var culture in cultures)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var url = content.Url(publishedUrlProvider, NullIfEmpty(culture), UrlMode.Absolute);
            if (Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
                (uri.Scheme == Uri.UriSchemeHttps || uri.Scheme == Uri.UriSchemeHttp))
            {
                return uri.GetLeftPart(UriPartial.Authority);
            }
        }

        return null;
    }

    private static string NormalizePath(string url)
    {
        var path = url.Split('?', '#')[0];
        return path.StartsWith('/') ? path : $"/{path}";
    }

    private static string? NullIfEmpty(string value) => value.Length == 0 ? null : value;
}

using Microsoft.Extensions.Options;
using Moq;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Services;

namespace Umbraco.VercelAnalytics.Tests.Services;

public sealed class AnalyticsDocumentRouteServiceTests
{
    [Fact]
    public async Task Root_mapping_wins_over_conflicting_hostname_mapping()
    {
        var rootKey = Guid.NewGuid();
        var documentKey = Guid.NewGuid();
        var contentService = CreateContentTree(rootKey, documentKey);
        var published = CreatePublishedDocument("conflict.example", "/news", "en-US");
        var accessor = new Mock<IAnalyticsPublishedContentAccessor>();
        accessor.Setup(value => value.GetDocumentAsync(documentKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync(published);
        var service = new AnalyticsDocumentRouteService(
            contentService.Object,
            accessor.Object,
            CreateRegistry(
                Connection("root", roots: [rootKey]),
                Connection("hostname", hostnames: ["conflict.example"])));

        var route = Assert.Single(await service.GetRoutesAsync(documentKey, "en-US", CancellationToken.None));

        Assert.Equal("root", route.Connection);
        Assert.True(route.IsCurrent);
        Assert.Contains(route.Warnings, warning => warning.Contains("document-root mapping is used", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task Hostname_mapping_is_used_when_no_ancestor_root_is_mapped()
    {
        var rootKey = Guid.NewGuid();
        var documentKey = Guid.NewGuid();
        var contentService = CreateContentTree(rootKey, documentKey);
        var accessor = new Mock<IAnalyticsPublishedContentAccessor>();
        accessor.Setup(value => value.GetDocumentAsync(documentKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync(CreatePublishedDocument("www.example.com", "/about", string.Empty));
        var service = new AnalyticsDocumentRouteService(
            contentService.Object,
            accessor.Object,
            CreateRegistry(Connection("site", hostnames: ["www.example.com"])));

        var route = Assert.Single(await service.GetRoutesAsync(documentKey, null, CancellationToken.None));

        Assert.Equal("site", route.Connection);
        Assert.Equal("/about", route.Path);
        Assert.Empty(route.Warnings);
    }

    [Fact]
    public async Task Disabled_document_type_has_no_routes()
    {
        var rootKey = Guid.NewGuid();
        var documentKey = Guid.NewGuid();
        var contentService = CreateContentTree(rootKey, documentKey);
        var accessor = new Mock<IAnalyticsPublishedContentAccessor>();
        accessor.Setup(value => value.GetDocumentAsync(documentKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync(CreatePublishedDocument("www.example.com", "/about", string.Empty));
        var service = new AnalyticsDocumentRouteService(
            contentService.Object,
            accessor.Object,
            CreateRegistry(Connection("site", hostnames: ["www.example.com"], documentTypes: ["homePage"])));

        var routes = await service.GetRoutesAsync(documentKey, null, CancellationToken.None);

        Assert.Empty(routes);
    }

    [Fact]
    public async Task All_published_cultures_are_returned_and_the_active_culture_is_marked()
    {
        var rootKey = Guid.NewGuid();
        var documentKey = Guid.NewGuid();
        var contentService = CreateContentTree(rootKey, documentKey);
        var accessor = new Mock<IAnalyticsPublishedContentAccessor>();
        accessor.Setup(value => value.GetDocumentAsync(documentKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new AnalyticsPublishedDocument(
                "articlePage",
                Guid.NewGuid(),
                [
                    new("en-US", "www.example.com", "/news", "https://www.example.com/news"),
                    new("da-DK", "www.example.dk", "/nyheder", "https://www.example.dk/nyheder")
                ]));
        var service = new AnalyticsDocumentRouteService(
            contentService.Object,
            accessor.Object,
            CreateRegistry(Connection("site", hostnames: ["www.example.com", "www.example.dk"])));

        var routes = await service.GetRoutesAsync(documentKey, "da-DK", CancellationToken.None);

        Assert.Equal(2, routes.Count);
        Assert.False(routes.Single(route => route.Culture == "en-US").IsCurrent);
        Assert.True(routes.Single(route => route.Culture == "da-DK").IsCurrent);
    }

    [Fact]
    public async Task Unpublished_document_has_no_routes()
    {
        var rootKey = Guid.NewGuid();
        var documentKey = Guid.NewGuid();
        var contentService = CreateContentTree(rootKey, documentKey);
        var accessor = new Mock<IAnalyticsPublishedContentAccessor>();
        accessor.Setup(value => value.GetDocumentAsync(documentKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AnalyticsPublishedDocument?)null);
        var service = new AnalyticsDocumentRouteService(
            contentService.Object,
            accessor.Object,
            CreateRegistry(Connection("site", hostnames: ["www.example.com"])));

        var routes = await service.GetRoutesAsync(documentKey, null, CancellationToken.None);

        Assert.Empty(routes);
    }

    [Fact]
    public async Task Document_root_provides_base_url_when_no_hostname_is_configured()
    {
        var rootKey = Guid.NewGuid();
        var accessor = new Mock<IAnalyticsPublishedContentAccessor>();
        accessor.Setup(value => value.GetBaseUrlAsync(rootKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync("https://root.example");
        var service = new AnalyticsDocumentRouteService(
            Mock.Of<IContentService>(),
            accessor.Object,
            CreateRegistry(Connection("root", roots: [rootKey])));

        var baseUrl = await service.GetConnectionBaseUrlAsync(
            CreateRegistry(Connection("root", roots: [rootKey])).Get("root")!,
            CancellationToken.None);

        Assert.Equal("https://root.example", baseUrl);
    }

    private static Mock<IContentService> CreateContentTree(Guid rootKey, Guid documentKey)
    {
        var root = new Mock<IContent>();
        root.SetupGet(value => value.Id).Returns(10);
        root.SetupGet(value => value.Key).Returns(rootKey);
        root.SetupGet(value => value.ParentId).Returns(-1);

        var document = new Mock<IContent>();
        document.SetupGet(value => value.Id).Returns(20);
        document.SetupGet(value => value.Key).Returns(documentKey);
        document.SetupGet(value => value.ParentId).Returns(10);

        var service = new Mock<IContentService>();
        service.Setup(value => value.GetById(documentKey)).Returns(document.Object);
        service.Setup(value => value.GetById(20)).Returns(document.Object);
        service.Setup(value => value.GetById(10)).Returns(root.Object);
        return service;
    }

    private static AnalyticsPublishedDocument CreatePublishedDocument(string hostname, string path, string culture) => new(
        "articlePage",
        Guid.NewGuid(),
        [new AnalyticsPublishedRoute(culture, hostname, path, $"https://{hostname}{path}")]);

    private static KeyValuePair<string, VercelAnalyticsConnectionOptions> Connection(
        string alias,
        IReadOnlyList<string>? hostnames = null,
        IReadOnlyList<Guid>? roots = null,
        IReadOnlyList<string>? documentTypes = null) => new(alias, new VercelAnalyticsConnectionOptions
        {
            DisplayName = alias,
            AccessToken = "secret",
            ProjectId = $"project-{alias}",
            Hostnames = hostnames?.ToArray() ?? [],
            DocumentRootKeys = roots?.Select(value => value.ToString()).ToArray() ?? [],
            EnabledDocumentTypes = documentTypes?.ToArray() ?? ["articlePage"]
        });

    private static VercelAnalyticsConnectionRegistry CreateRegistry(
        params KeyValuePair<string, VercelAnalyticsConnectionOptions>[] connections) => new(Options.Create(new VercelAnalyticsOptions
        {
            Enabled = true,
            DefaultConnection = connections[0].Key,
            Connections = connections.ToDictionary(pair => pair.Key, pair => pair.Value, StringComparer.OrdinalIgnoreCase)
        }));
}

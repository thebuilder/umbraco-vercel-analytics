using Microsoft.Extensions.Caching.Memory;
using Moq;
using Umbraco.VercelAnalytics.Configuration;
using Umbraco.VercelAnalytics.Services;

namespace Umbraco.VercelAnalytics.Tests.Services;

public sealed class VercelProjectNameServiceTests
{
    [Fact]
    public async Task Resolves_and_caches_the_vercel_project_name()
    {
        var client = new Mock<IVercelAnalyticsClient>(MockBehavior.Strict);
        var connection = CreateConnection();
        client.Setup(item => item.GetProjectNameAsync(connection, It.IsAny<CancellationToken>()))
            .ReturnsAsync("health-platform");
        var service = new VercelProjectNameService(client.Object, new MemoryCache(new MemoryCacheOptions()));

        var first = await service.GetDisplayNameAsync(connection, CancellationToken.None);
        var second = await service.GetDisplayNameAsync(connection, CancellationToken.None);

        Assert.Equal("health-platform", first);
        Assert.Equal(first, second);
        client.Verify(item => item.GetProjectNameAsync(connection, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Falls_back_to_project_id_when_metadata_is_unavailable()
    {
        var client = new Mock<IVercelAnalyticsClient>(MockBehavior.Strict);
        var connection = CreateConnection();
        client.Setup(item => item.GetProjectNameAsync(connection, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new VercelAnalyticsApiException(System.Net.HttpStatusCode.Forbidden));
        var service = new VercelProjectNameService(client.Object, new MemoryCache(new MemoryCacheOptions()));

        var result = await service.GetDisplayNameAsync(connection, CancellationToken.None);

        Assert.Equal("project", result);
    }

    private static VercelAnalyticsConnection CreateConnection() => new(
        Guid.Parse("11111111-1111-1111-1111-111111111110"),
        "Old display name",
        "secret",
        "project",
        "team_123",
        [],
        true,
        new HashSet<Guid>(),
        new HashSet<string>());
}

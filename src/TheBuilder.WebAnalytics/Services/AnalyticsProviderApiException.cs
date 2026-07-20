using System.Net;
using TheBuilder.WebAnalytics.Models;

namespace TheBuilder.WebAnalytics.Services;

public sealed class AnalyticsProviderApiException(
    HttpStatusCode statusCode,
    AnalyticsProvider provider = AnalyticsProvider.Vercel)
    : Exception($"{provider} Analytics returned HTTP {(int)statusCode}.")
{
    public HttpStatusCode StatusCode { get; } = statusCode;

    public AnalyticsProvider Provider { get; } = provider;
}

using System.Net;

namespace Umbraco.VercelAnalytics.Services;

public sealed class VercelAnalyticsApiException(HttpStatusCode statusCode)
    : Exception($"Vercel Analytics returned HTTP {(int)statusCode}.")
{
    public HttpStatusCode StatusCode { get; } = statusCode;
}

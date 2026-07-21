using Microsoft.Extensions.DependencyInjection;
using TheBuilder.WebAnalytics.Configuration;
using TheBuilder.WebAnalytics.Models;
using TheBuilder.WebAnalytics.Services;

namespace TheBuilder.WebAnalytics.Providers;

internal static class VercelProvider
{
    internal static AnalyticsProviderDefinition Definition { get; } = new(
        AnalyticsProvider.Vercel,
        new(
            [
                AnalyticsDimension.RequestPath,
                AnalyticsDimension.Route,
                AnalyticsDimension.ReferrerHostname,
                AnalyticsDimension.Country,
                AnalyticsDimension.DeviceType,
                AnalyticsDimension.BrowserName,
                AnalyticsDimension.OsName,
                AnalyticsDimension.UtmSource,
                AnalyticsDimension.UtmMedium,
                AnalyticsDimension.UtmCampaign,
                AnalyticsDimension.UtmTerm,
                AnalyticsDimension.UtmContent,
                AnalyticsDimension.EventName
            ],
            Events: true,
            EventDetails: true,
            EventProperties: true,
            GlobalEventFiltering: false,
            Flags: true,
            BreakdownOrdering: false),
        AnalyticsConnectionIdentifier.ProjectId,
        new(
            "Projects using Vercel Web Analytics",
            "vercel",
            new("projectId", "Vercel project ID", "Use the project ID from your Vercel project settings.", "a Vercel project ID"),
            new("team", "Vercel team", "Optional team slug or ID for projects owned by a Vercel team."),
            new("access token", "Configure a Vercel access token in the server settings.", "https://vercel.com/docs/rest-api"),
            null),
        options => options.Providers.Vercel.AccessToken,
        static (services, definition) => services.AddAnalyticsProvider<VercelAnalyticsClient>(definition, new Uri("https://api.vercel.com/")));
}

using System.Text.Json.Serialization;

namespace Umbraco.VercelAnalytics.Models;

[JsonConverter(typeof(JsonStringEnumConverter<AnalyticsInterval>))]
public enum AnalyticsInterval
{
    Day,
    Week,
    Month
}

[JsonConverter(typeof(JsonStringEnumConverter<AnalyticsDimension>))]
public enum AnalyticsDimension
{
    RequestPath,
    Route,
    ReferrerHostname,
    Country,
    DeviceType,
    BrowserName,
    OsName,
    UtmSource,
    UtmMedium,
    UtmCampaign,
    EventName
}

public sealed record AnalyticsQuery(
    string Connection,
    DateOnly From,
    DateOnly To,
    AnalyticsInterval Interval,
    string? RequestPath = null,
    IReadOnlyList<AnalyticsFilter>? Filters = null);

public sealed record AnalyticsFilter(AnalyticsDimension Dimension, string Value);

public sealed record AnalyticsEventDataFilter(string Property, string Value);

public sealed record AnalyticsTotals(long PageViews, long Visitors);

public sealed record AnalyticsPoint(DateTimeOffset Timestamp, long PageViews, long Visitors);

public sealed record AnalyticsSummary(
    AnalyticsTotals Totals,
    AnalyticsTotals? PreviousTotals,
    IReadOnlyList<AnalyticsPoint> Points);

public sealed record AnalyticsBreakdownRow(string Value, long PageViews, long Visitors);

public sealed record AnalyticsBreakdown(
    AnalyticsDimension Dimension,
    IReadOnlyList<AnalyticsBreakdownRow> Rows);

public sealed record AnalyticsEventTotals(long Count, long Visitors);

public sealed record AnalyticsEventRow(string EventName, long Count, long Visitors);

public sealed record AnalyticsEventsReport(IReadOnlyList<AnalyticsEventRow> Rows);

public sealed record AnalyticsEventPropertyValue(string Value, long Count, long Visitors);

public sealed record AnalyticsEventProperty(
    string Name,
    IReadOnlyList<AnalyticsEventPropertyValue> Values);

public sealed record AnalyticsEventDetails(
    string EventName,
    AnalyticsEventTotals Totals,
    IReadOnlyList<AnalyticsEventProperty> Properties);

public sealed record AnalyticsConnectionSummary(
    string Alias,
    string DisplayName,
    bool IsDefault,
    bool IsConfigured,
    string? BaseUrl,
    IReadOnlyList<string> Hostnames,
    IReadOnlyList<string> Warnings);

public sealed record AnalyticsConnectionsResponse(
    bool Enabled,
    string? DefaultConnection,
    int DefaultRangeDays,
    IReadOnlyList<AnalyticsConnectionSummary> Connections);

public sealed record AnalyticsDocumentRoute(
    string Connection,
    string Culture,
    string Hostname,
    string Path,
    string Url,
    bool IsCurrent,
    IReadOnlyList<string> Warnings);

public sealed record AnalyticsSettingsResponse(
    bool Enabled,
    string? DefaultConnection,
    int DefaultRangeDays,
    string CacheDuration,
    IReadOnlyList<AnalyticsConnectionSettingsResponse> Connections);

public sealed record AnalyticsConnectionSettingsResponse(
    string Alias,
    string DisplayName,
    string ProjectId,
    string? TeamId,
    string? TeamSlug,
    IReadOnlyList<string> Hostnames,
    IReadOnlyList<string> DocumentRootKeys,
    bool EnableAllDocumentTypes,
    IReadOnlyList<string> EnabledDocumentTypeKeys,
    bool HasAccessToken);

public sealed record UpdateAnalyticsSettingsRequest(
    bool Enabled,
    string? DefaultConnection,
    int DefaultRangeDays,
    string CacheDuration,
    IReadOnlyList<UpdateAnalyticsConnectionRequest> Connections);

public sealed record UpdateAnalyticsConnectionRequest(
    string Alias,
    string DisplayName,
    string ProjectId,
    string? TeamId,
    string? TeamSlug,
    IReadOnlyList<string> Hostnames,
    IReadOnlyList<string> DocumentRootKeys,
    bool EnableAllDocumentTypes,
    IReadOnlyList<string> EnabledDocumentTypeKeys);

public sealed record AnalyticsConnectionTestResult(bool Success, string Message);

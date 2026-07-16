using System.Text.RegularExpressions;

namespace Umbraco.VercelAnalytics.Configuration;

public static partial class VercelAnalyticsSettingsValidator
{
    public static IReadOnlyList<string> Validate(VercelAnalyticsSettings settings) =>
        Validate(settings, VercelAnalyticsValidationMode.PersistedSettings);

    internal static IReadOnlyList<string> Validate(
        VercelAnalyticsSettings settings,
        VercelAnalyticsValidationMode mode)
    {
        var validateEnabledState = mode == VercelAnalyticsValidationMode.PersistedSettings;
        var failures = new List<string>();
        if (settings.DefaultRangeDays is < 1 or > 730)
            failures.Add("Default range must be between 1 and 730 days.");
        if (settings.CacheDuration < TimeSpan.Zero || settings.CacheDuration > TimeSpan.FromHours(1))
            failures.Add("Cache duration must be between zero and one hour.");
        if (validateEnabledState && settings.Enabled && settings.Connections.Count == 0)
            failures.Add("Add at least one connection before enabling analytics.");

        var aliases = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var hostnames = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        var roots = new Dictionary<Guid, string>();
        foreach (var connection in settings.Connections)
        {
            ValidateConnection(
                connection,
                failures,
                aliases,
                hostnames,
                roots,
                validateEnabledState);
        }

        if (validateEnabledState && settings.Enabled && (string.IsNullOrWhiteSpace(settings.DefaultConnection) ||
            !aliases.Contains(settings.DefaultConnection)))
        {
            failures.Add("Choose a default connection before enabling analytics.");
        }

        return failures;
    }

    private static void ValidateConnection(
        VercelAnalyticsConnectionSettings connection,
        ICollection<string> failures,
        ISet<string> aliases,
        IDictionary<string, string> hostnames,
        IDictionary<Guid, string> roots,
        bool requireConnectionMetadata)
    {
        var alias = connection.Alias.Trim();
        if (!AliasPattern().IsMatch(alias))
            failures.Add("Connection aliases must start with a letter or number and contain only letters, numbers, hyphens, and underscores.");
        else if (!aliases.Add(alias))
            failures.Add($"Connection alias '{alias}' is used more than once.");
        if (requireConnectionMetadata && string.IsNullOrWhiteSpace(connection.DisplayName))
            failures.Add($"Connection '{alias}' requires a display name.");
        if (requireConnectionMetadata && string.IsNullOrWhiteSpace(connection.ProjectId))
            failures.Add($"Connection '{alias}' requires a project ID.");
        if (!string.IsNullOrWhiteSpace(connection.TeamId) && !string.IsNullOrWhiteSpace(connection.TeamSlug))
            failures.Add($"Connection '{alias}' cannot configure both TeamId and TeamSlug.");

        foreach (var hostname in connection.Hostnames)
        {
            var normalized = VercelAnalyticsConnectionRegistry.NormalizeHostname(hostname);
            if (normalized is null)
                failures.Add($"Connection '{alias}' contains invalid hostname '{hostname}'.");
            else if (hostnames.TryGetValue(normalized, out var owner))
                failures.Add($"Hostname '{normalized}' is assigned to both '{owner}' and '{alias}'.");
            else
                hostnames[normalized] = alias;
        }

        foreach (var value in connection.DocumentRootKeys)
        {
            if (!Guid.TryParse(value, out var key))
                failures.Add($"Connection '{alias}' contains invalid document root key '{value}'.");
            else if (roots.TryGetValue(key, out var owner))
                failures.Add($"Document root '{key}' is assigned to both '{owner}' and '{alias}'.");
            else
                roots[key] = alias;
        }

        foreach (var value in connection.EnabledDocumentTypeKeys)
        {
            if (!Guid.TryParse(value, out _))
                failures.Add($"Connection '{alias}' contains invalid document type key '{value}'.");
        }
    }

    [GeneratedRegex("^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$", RegexOptions.CultureInvariant)]
    private static partial Regex AliasPattern();
}

internal enum VercelAnalyticsValidationMode
{
    PersistedSettings,
    ServerOptions
}

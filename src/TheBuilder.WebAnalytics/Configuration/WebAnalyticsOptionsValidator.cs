using Microsoft.Extensions.Options;

namespace TheBuilder.WebAnalytics.Configuration;

public sealed class WebAnalyticsOptionsValidator : IValidateOptions<WebAnalyticsOptions>
{
    public ValidateOptionsResult Validate(string? name, WebAnalyticsOptions options)
    {
        var settings = WebAnalyticsSettingsMapper.FromServerOptions(options);
        var failures = WebAnalyticsSettingsValidator.Validate(
            settings,
            WebAnalyticsValidationMode.ServerOptions);

        return failures.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(failures);
    }
}

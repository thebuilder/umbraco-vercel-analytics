using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace Umbraco.VercelAnalytics.Controllers
{
    [ApiController]
    [BackOfficeRoute("umbracovercelanalytics/api/v{version:apiVersion}")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [MapToApi(Constants.ApiName)]
    public class UmbracoVercelAnalyticsApiControllerBase : ControllerBase
    {
    }
}

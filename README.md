# Umbraco Vercel Analytics

`Umbraco.VercelAnalytics` brings Vercel Web Analytics into the Umbraco 17 backoffice. It adds a dedicated Analytics section and an Analytics view on mapped, published documents without sending Vercel credentials to the browser.

## Requirements

- Umbraco CMS 17.1 or later
- A Vercel project with Web Analytics enabled
- A Vercel access token that can read Web Analytics for the project

## Install and configure

Install the NuGet package, start Umbraco, and open **Settings → Vercel Analytics** as an administrator. The dashboard stores the non-secret settings in Umbraco:

- Connection alias and display name
- Vercel project ID and optional team ID or team slug
- Optional published hostnames and document roots
- Either all document types or an exact selection from Umbraco's document-type picker
- Default connection, date range, cache duration, and package status

Keep each access token in an environment variable, user-secrets, or deployment secret store. The alias in the variable must match the alias configured in the dashboard:

```sh
export VercelAnalytics__Connections__main-site__AccessToken="your_token"
```

Restart the application after adding or changing a token. The Settings dashboard shows whether a token was found and provides a **Save and test** action. The token is never stored in Umbraco or returned to the browser.

For a personal Vercel project, leave both team fields empty. For a team project, provide either the team ID or team slug, never both.

### Document analytics and mappings

Hostnames and document roots are independently optional, and both may be empty. A connection without either mapping still works in the global Analytics section; it simply does not add analytics to document workspaces.

When page analytics is required, add one or both mapping types. The nearest mapped document root takes precedence over a hostname mapping. Hostnames are exact matches in version 1.

Document-type enablement has two explicit modes:

- **All document types**, including types added later.
- **Selected document types**, chosen by key through Umbraco's native picker.

Wildcard aliases such as `*Page` are intentionally not supported because aliases are editable and pattern results would be difficult to preview or audit in the picker UI.

Grant the relevant Umbraco user groups access to the **Analytics** section. Document reports additionally require Content-section access and read permission for the document.

### Full appsettings configuration

Existing installations may continue to configure non-secret values in appsettings. The backoffice dashboard is the recommended setup for new installations.

```json
{
  "VercelAnalytics": {
    "Enabled": true,
    "DefaultConnection": "main-site",
    "DefaultRangeDays": 30,
    "CacheDuration": "00:05:00",
    "Connections": {
      "main-site": {
        "DisplayName": "Main website",
        "AccessToken": "",
        "ProjectId": "prj_...",
        "TeamId": "team_...",
        "TeamSlug": null,
        "Hostnames": ["www.example.com", "example.com"],
        "DocumentRootKeys": ["11111111-1111-1111-1111-111111111111"],
        "EnableAllDocumentTypes": false,
        "EnabledDocumentTypeKeys": ["22222222-2222-2222-2222-222222222222"]
      }
    }
  }
}
```

Alias-based `EnabledDocumentTypes` remains supported for legacy appsettings configuration, but the Settings dashboard stores stable document-type keys.

## Development

The repository uses the official Umbraco 17.1 extension template and pnpm 11. From `src/Umbraco.VercelAnalytics/Client`:

```sh
corepack pnpm install
corepack pnpm check
corepack pnpm test
corepack pnpm build
```

Run the example host before regenerating the OpenAPI client, then pass its Swagger URL with `corepack pnpm generate-client -- <swagger-url>`. The access token and OData filters remain server-side.

See [docs/roadmap.md](docs/roadmap.md) for deliberately non-binding ideas beyond the initial release.

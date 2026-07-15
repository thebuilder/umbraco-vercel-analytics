# Umbraco Vercel Analytics

`Umbraco.VercelAnalytics` brings Vercel Web Analytics into the Umbraco 17 backoffice. It adds a dedicated Analytics section and an Analytics view on mapped, published documents without sending Vercel credentials to the browser.

## Requirements

- Umbraco CMS 17.1 or later
- A Vercel project with Web Analytics enabled
- A Vercel access token that can read Web Analytics for the project

## Install and configure

Install the NuGet package and add server-side configuration. Keep `AccessToken` in an environment variable, user-secrets, or deployment secret store rather than a committed settings file.

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
        "EnabledDocumentTypes": ["homePage", "contentPage", "articlePage"]
      }
    }
  }
}
```

For a personal Vercel project, omit both `TeamId` and `TeamSlug`. For a team project, provide exactly one. A connection must have at least one exact hostname or document-root key. Document-root mappings take precedence over hostname mappings.

Example environment-variable secret:

```sh
VercelAnalytics__Connections__main-site__AccessToken=your_token
```

Grant the relevant Umbraco user groups access to the **Analytics** section. Document reports additionally require Content-section access and read permission for the document.

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

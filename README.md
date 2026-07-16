# Umbraco Vercel Analytics

`Umbraco.VercelAnalytics` displays Vercel Web Analytics in the Umbraco 17 backoffice.

It provides:

- A global **Analytics** section for traffic, audience, referrers, pages, routes, UTM data, and custom events.
- An **Analytics** workspace view on configured, published documents, filtered to the document's route.
- Multiple Vercel project connections for multi-site Umbraco installations.
- Server-side Vercel API access so the access token is never sent to the browser.

The package reads analytics already collected by Vercel. It does not add Vercel tracking to the public website.

## Requirements

- Umbraco CMS 17.1 or later.
- A Vercel project with [Web Analytics enabled and installed](https://vercel.com/docs/analytics/quickstart).
- A [Vercel access token](https://vercel.com/kb/guide/how-do-i-use-a-vercel-api-access-token) scoped to the personal account or team that owns the project.
- The Vercel project ID (`prj_...`).

## Install

Add the package to the Umbraco web project:

```sh
dotnet add path/to/Your.Umbraco.Web.csproj package Umbraco.VercelAnalytics
```

The package registers its services and backoffice extensions automatically. No changes to `Program.cs` are required.

Build and deploy the Umbraco application as usual. The package's `App_Plugins` assets are included in the publish output through NuGet static web assets.

## Configure a production connection

Configuration uses two sources:

- Project details, mappings, and display settings are stored in Umbraco.
- The Vercel access token stays in the application's secret configuration.

### 1. Create a Vercel access token

Create a token in the Vercel account settings and scope it to the account or team that owns the project. Copy it when it is created; Vercel does not show it again.

For a team-owned project, also copy either the team ID or team slug. Personal projects do not need either value. Vercel API requests use the token as a bearer token and the team identifier to access team resources. See the [Vercel REST API authentication documentation](https://vercel.com/docs/rest-api).

### 2. Add the token to the Umbraco deployment

Choose a short connection alias that is safe to use in an environment variable, for example `main`. Configure the token using the same alias:

```text
VercelAnalytics__Connections__main__AccessToken
```

Examples:

```sh
# Local shell or container environment
export VercelAnalytics__Connections__main__AccessToken="your_token"

# .NET user-secrets
dotnet user-secrets init \
  --project path/to/Your.Umbraco.Web.csproj

dotnet user-secrets set \
  "VercelAnalytics:Connections:main:AccessToken" \
  "your_token" \
  --project path/to/Your.Umbraco.Web.csproj
```

Use the equivalent secret/app-setting facility in Azure App Service, Kubernetes, Docker, or the hosting platform. Do not commit the token to `appsettings.json` or source control.

Restart every Umbraco application instance after adding, rotating, or renaming a token. Tokens are loaded from server configuration at application startup.

### 3. Configure the connection in Umbraco

Sign in as an administrator and open **Settings → Vercel Analytics**.

1. Select **Add connection**.
2. Set **Alias** to the alias used in the secret key, such as `main`.
3. Enter a display name and the Vercel project ID.
4. For a team project, enter either the team ID or team slug, not both.
5. Configure page analytics mappings if document-level reports are required.
6. Select the document types that should display the Analytics workspace view, or enable all document types.
7. Enable the package and select the default connection.
8. Select **Save and test**.

The test confirms that Vercel accepts the token, project, and team configuration. The settings screen reports whether a server-side token was found for the alias; it never displays or stores the token itself.

## Document analytics mappings

Mappings are optional. A connection without mappings is available in the global Analytics section but does not add reports to document workspaces.

For document analytics, configure one or both of the following:

- **Document roots:** Select each Umbraco site's root document. This is the recommended mapping for multi-site installations.
- **Hostname fallback:** Enter exact published hostnames, one per line, without a scheme, port, or path. For example, `www.example.com`.

When both mappings match, the nearest mapped document root is used. Hostname matching is used as the fallback.

The document Analytics view is shown only when all of these conditions are met:

- The document is published and has a published route.
- Its document root or hostname resolves to a connection.
- Its document type is enabled for that connection.
- The current user has Content-section access and read permission for the document.

## Backoffice permissions

On the first successful package startup, the Analytics section is added to the built-in **Administrators** user group. This initialization runs once and does not re-add the section if it is removed later.

To give other users access, add the **Analytics** section to their Umbraco user group. Global reports require Analytics-section access. Document reports additionally require Content-section access and document read permission.

Only administrators can open or update **Settings → Vercel Analytics**.

## Configuration-only setup

The backoffice settings screen is the normal configuration path. A deployment can instead bootstrap all non-secret settings from `appsettings.json`:

```json
{
  "VercelAnalytics": {
    "Enabled": true,
    "DefaultConnection": "main",
    "DefaultRangeDays": 30,
    "CacheDuration": "00:05:00",
    "Connections": {
      "main": {
        "DisplayName": "Main website",
        "ProjectId": "prj_...",
        "TeamId": "team_...",
        "TeamSlug": null,
        "Hostnames": [
          "www.example.com",
          "example.com"
        ],
        "DocumentRootKeys": [
          "11111111-1111-1111-1111-111111111111"
        ],
        "EnableAllDocumentTypes": false,
        "EnabledDocumentTypeKeys": [
          "22222222-2222-2222-2222-222222222222"
        ]
      }
    }
  }
}
```

Keep `AccessToken` out of the JSON file and supply it through secret configuration using the key shown above.

Before the settings screen has saved anything, Umbraco uses these server options as the initial configuration. After an administrator saves the settings screen, the non-secret settings are stored in Umbraco's database and become the source of truth. The access token continues to come from server configuration by connection alias.

In a load-balanced deployment, restart all Umbraco instances after changing saved connection settings or server-side tokens so every process uses the same configuration.

## Operational settings

| Setting | Purpose | Valid values |
| --- | --- | --- |
| Package status | Enables or disables analytics throughout the backoffice. | On/off |
| Default connection | Connection selected when no valid connection is present in the URL or browser state. | A configured alias |
| Default range | Initial reporting period. | 1–730 days |
| Cache duration | Server-side in-memory cache for Vercel responses. | `00:00:00`–`01:00:00` |

The default cache duration is five minutes. Each Umbraco instance maintains its own in-memory report cache.

## Verify the deployment

After deployment:

1. Open **Settings → Vercel Analytics** and confirm the connection says **Token configured**.
2. Run **Save and test**.
3. Open the global **Analytics** section and confirm totals and history load.
4. If document analytics is enabled, open a mapped published document and select its **Analytics** workspace view.
5. Grant the Analytics section to any non-administrator user groups that need global reports.

The available reporting window and some dimensions depend on the Vercel plan and the data recorded by the project. Unsupported optional panels are hidden rather than treated as connection failures.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| **Token missing** | The environment/user-secret alias must exactly match the connection alias. Restart the application after changing the secret. |
| Vercel returns `401` or `403` | Confirm the token is valid, scoped to the owning account/team, and has access to the configured project. |
| Vercel returns `400` | Verify the project ID and team ID/slug. Do not configure both team fields. |
| Analytics section is not visible | Add the Analytics section to the user's Umbraco user group. The automatic administrator grant runs only once. |
| Document Analytics view is not visible | Confirm the document is published, mapped by root or hostname, uses an enabled document type, and the user can read it. |
| No data appears | Confirm Web Analytics is enabled and installed on the public site, production traffic has been recorded, and the selected date is inside Vercel's reporting window. |
| Settings differ between application instances | Restart every instance after changing settings or tokens. |

## Development

The client uses pnpm 11. From `src/Umbraco.VercelAnalytics/Client`:

```sh
corepack pnpm install
corepack pnpm check
corepack pnpm test
corepack pnpm build
```

Run the example host before regenerating the OpenAPI client, then pass its Swagger URL to:

```sh
corepack pnpm generate-client -- <swagger-url>
```

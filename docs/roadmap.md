# Roadmap

This roadmap is deliberately non-binding. Items marked **confirmed** have a documented upstream API capability; items marked **exploratory** need API validation, product design, or both before implementation.

## Reporting depth

- **Confirmed:** previous-period totals and percentage changes can be calculated from additional count queries, subject to Vercel's reporting window and request limits.
- **Exploratory:** bounce and engagement metrics require a reliable supported API source before they can be promised.

References: [Web Analytics API](https://vercel.com/docs/analytics/web-analytics-api), [limits and pricing](https://vercel.com/docs/analytics/limits-and-pricing).

## Events and experimentation

- **Confirmed:** Vercel supports custom event collection and event-data retrieval on eligible plans.
- **Exploratory:** conversion funnels, feature-flag impact, and editorially defined event dashboards.

References: [custom events](https://vercel.com/docs/analytics/custom-events), [Web Analytics API](https://vercel.com/docs/analytics/web-analytics-api).

## Editorial workflows

- **Exploratory:** CSV export, saved reports, scheduled reports, and configurable dashboard layouts.
- Exports must retain the same document-permission checks as the interactive report.

## Administration

- **Confirmed and delivered:** administrators can manage non-secret connections, mappings, document-type selection, and connection tests from the Umbraco Settings section.
- **Exploratory:** finer-grained settings permissions, secret-provider integrations, and secure backoffice-assisted token onboarding without persisting tokens in Umbraco.
- Tokens must remain in server-side secret storage and must never be returned by a Management API.

Reference: [Vercel authentication](https://vercel.com/docs/rest-api/reference/welcome#authentication).

## Multi-project insight

- **Exploratory:** combined cross-project overview, domain groups, and side-by-side project comparison.
- Cross-project totals require explicit semantics for deduplication and time-zone alignment.

## Data expansion

- **Exploratory:** preview-environment analytics, optional external historical storage, and trends beyond Vercel's retention window.
- Production-only reporting remains the default unless Vercel documents a stable environment filter for these endpoints.

References: [aggregate Web Analytics data](https://vercel.com/docs/rest-api/web-analytics/aggregates-page-views), [limits and pricing](https://vercel.com/docs/analytics/limits-and-pricing).

# Releasing the NuGet package

Package versions are release-driven. The version in the project file is the local-development fallback; the publish workflow supplies the package version explicitly.

## One-time setup

1. Create the `nuget-test` and `nuget` GitHub environments.
2. Add a `NUGET_USER` environment secret to each environment containing the username for the corresponding NuGet gallery.
3. Add required reviewers to the `nuget` environment if production publishing should require explicit approval.
4. Configure a trusted publishing policy on `int.nugettest.org` with:
   - Repository owner: `thebuilder`
   - Repository: `web-analytics`
   - Workflow: `publish-nuget.yml`
   - Environment: `nuget-test`
5. Configure a trusted publishing policy on nuget.org with:
   - Repository owner: `thebuilder`
   - Repository: `web-analytics`
   - Workflow: `publish-nuget.yml`
   - Environment: `nuget`

## Validate a package

1. Run the **Publish NuGet package** workflow manually.
2. Enter a unique prerelease version such as `0.2.0-preview.1`.
3. Install and inspect that version from `https://apiint.nugettest.org/v3/index.json`.

Alternatively, publish a GitHub Release marked as a prerelease with a prerelease tag. GitHub prereleases are routed to `int.nugettest.org`; they are never published to nuget.org.

Test packages must use prerelease versions, and NuGet package versions are immutable. Increment the prerelease number for every test publish.

## Publish to nuget.org

1. Create a GitHub Release from the commit to publish.
2. Give it a new SemVer tag such as `v0.2.0`.
3. Ensure **Set as a pre-release** is not selected.
4. Publish the release.

Publishing the stable release triggers the workflow. It removes the optional leading `v`, packs `TheBuilder.WebAnalytics` as version `0.2.0`, runs the test suite, uploads the package as a workflow artifact, and publishes it with a short-lived OIDC credential. The workflow rejects prerelease version tags in the production path.

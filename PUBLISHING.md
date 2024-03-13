# Publishing releases

The release/publishing process is as follows:

1.  Checkout `master`, rebase, and make sure it's in a clean state __with no pending commits__ not yet pushed to origin.
2.  Rename the __UNRELEASED__ section in the `/CHANGELOG.md` to the new version being released.
    - For example, `## UNRELEASED -> ## v1.0.0`
3.  Commit changes to `/CHANGELOG.md` using a commit message like `"Changes for version x.y.z"`.
4.  Run `npm version <major|minor|patch>` to version the `package.json` and create a git tag.
5.  Run `npm publish`
6.  Push commits and tags to origin: `git push && git push --tags`

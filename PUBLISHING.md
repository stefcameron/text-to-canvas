# Publishing releases

The release/publishing process is as follows:

1.  Checkout `master`, rebase, and make sure it's in a clean state __with no pending commits__ not yet pushed to origin.
2.  Move all entries under the __UNRELEASED__ section in the `/CHANGELOG.md` into a new version section matching the version number that will be released.
    -   Include the release date in the new section in `YYYY-MM-DD` format.
    -   Remove the __UNRELEASED__ section.
3.  Commit changes to `/CHANGELOG.md` using a commit message like `"Changes for version x.y.z"`.
4.  Run `npm version <major|minor|patch>` to version the `package.json` and create a git tag.
5.  Run `npm publish`
6.  Push commits and tags to origin: `git push && git push --tags`

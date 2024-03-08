<!--
Thank you for your contribution! 🎉

Please be sure to go over the PR CHECKLIST below before posting your PR to make sure we all think of "everything". :)
-->

...ADD PR DETAILS HERE...

<details>
<summary>PR Checklist</summary>
<br/>

__Please leave this checklist in your PR.__

- Issue being fixed is referenced.
- Source changes maintain browser compatibility.
- Web APIs introduced have __broad__ browser coverage (remember to check Safari which is often very late to adopt new APIs).
- Docs app has been updated (if applicable).
- Unit test coverage added/updated.
- Typings added/updated.
- Changes do not break SSR:
  - Careful to test `typeof document/window !== 'undefined'` before using it in code that gets executed on load.
- README updated (API changes, instructions, etc.).
- Changes to dependencies explained.
- Changelog entry added under "UNRELEASED" section (added if did not exist).
  - See [Contributing](../CONTRIBUTING.md) instructions for guidance.
  - EXCEPTION: A Changelog entry is not required if the change does not affect any of the source files that produce the package bundles. For example, demo changes, tooling changes, test updates, or a new dev-only dependency to run tests more efficiently should not have a Changelog entry since it will not affect package consumers.

</details>

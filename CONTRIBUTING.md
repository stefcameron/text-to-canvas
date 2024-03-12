# Contributing

Thank you for considering a contribution to this project!

## Development

Local development is straightforward. Use the following CLI tools:

*   `node`: At least the latest __Active__ LTS (note CI will test with latest stable version)
*   `npm`: See package.json `engines` requirement

Install all project dependencies:

```bash
$ npm install
```

## Scripts

The following package scripts will get you started:

*   `build`: Builds the library, outputs to `./dist`
*   `demo:node`: Runs the node demo, outputs to `./demo`
*   `docs`: Builds the docs app, outputs to `./dist-docs`
*   `fmt`: Formats the code using Prettier.
*   `fmt:check`: Checks code formatting without making any changes.
*   `lint`: Checks the code for lint (syntax, style, types)
*   `lint:code`: Check the code for syntax lint (i.e. `eslint`)
*   `lint:types`: Check the types (i.e. `tsc`)
*   `start`: Runs the docs app locally on [localhost:5173](http://localhost:5173/)
*   `test`: Runs all unit tests, linting, and library build
*   `test:unit`: Runs unit tests only

See `/package.json` scripts for other commands.

## Testing

At the moment, the Docs app (`npm start`) and the Node demo (`npm demo:node` or `npm run test:unit`) (although `text-to-canvas` does not formally support Node nor the `node-canvas` library used in the demo) are the only "tests".

Run `npm test`, the Docs app, and the Node demo and manually verify your changes as best as you can.

## Pull requests

Always include a new bullet point in the [CHANGELOG](./CHANGELOG.md) under the __UNRELEASED__ heading at the very top.

Include your change description in one of the following subsections under "UNRELEASED":

> If an "UNRELEASED" heading doesn't exist, please add one!

-   "Breaking": If your change alters an existing API/type in a way that is not backward-compatible, or makes use of a Web API that doesn't yet have wide browser support.
    -   __AVOID__ this type of change as best as possible.
-   "Added": If your change adds a new feature without breaking anything pre-existing.
-   "Changed": If your change alters existing behavior without breaking anything pre-existing, including bug fixes.
    -   If you're fixing a bug, try to start your change description with, "Fixed ..."
-   Always link to the issue being addressed when applicable, typically ending your change description with `([#123](https://github.com/stefcameron/text-to-canvas/issues/123))`

And please fill-out the pull request template when prompted!

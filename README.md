# Monite SDK
Use Monite SDK to embed invoicing and payables powered by [Monite](https://monite.com/) into your products.
The SDK provides React UI components for displaying and managing data served via the Monite API, as well as a standalone JavaScript API client for those whose prefer to build a UI from scratch.

## Packages
This repository is a monorepo that contains several npm packages. The packages can be installed individually so you can use only what you need. For the usage examples, see the READMEs of the individual packages (linked below):

* [**@team-monite/ui-widgets-react**](./packages/ui-widgets-react/) - A library of ready-to-use React UI components connected to the Monite API. Can be used to display and manage data served by the API.

* [**@team-monite/ui-kit-react**](./packages/ui-kit-react/) - Low-level UI components (buttons, labels, input fields, and others) that implement Monite's design system. Used as building blocks for more advanced components from the `ui-widgets-react` package.

* [**@team-monite/sdk-api**](./packages/sdk-api/) - A JavaScript library for making requests to the Monite API.

## Requirements
Before using any of these packages, you need to register a partner account with Monite, get API credentials, and generate an access token. For details, see [Get started with Monite API](https://docs.monite.com/docs/get-started).

## Further information
* [Monite documentation](https://docs.monite.com/docs/)

## License
MIT
# Monite API client for JavaScript

[![npm version](https://badge.fury.io/js/%40team-monite%2Fsdk-api.svg)](https://www.npmjs.com/package/@team-monite/sdk-api)

`@team-monite/sdk-api` is a library for interacting with the [Monite API](https://docs.monite.com/docs) from JavaScript and TypeScript code.

This library is used internally by [Monite UI Widgets](https://github.com/team-monite/monite-sdk/packages/ui-widgets-react/) to make requests to the Monite API.
It can also be used as a standalone API client.

**Note:** This library is part of a [monorepo](https://github.com/team-monite/monite-sdk). See the main [README](https://github.com/team-monite/monite-sdk/#readme) for more information.

## Requirements

* Runtime:
  * Node.js 16 or later.
  * Supported browsers: five latest versions of Chrome, Firefox, Safari, Edge, and Opera.
* At least 8 GB RAM on each development workstation.
* A partner account registered with Monite. Follow the [Get started with Monite API](https://docs.monite.com/docs/get-started) guide to set up your partner account, get API credentials, and generate an access token.

## Installation

```sh
npm install @team-monite/sdk-api --save --force
```
or
```sh
yarn add @team-monite/sdk-api
```

## Usage

Example to get a list of an entity's counterparts:

```js
import { MoniteApp } from '@team-monite/sdk-api';

const monite = new MoniteApp({
  apiUrl: 'https://api.sandbox.monite.com/v1',  // Or 'https://api.monite.com/v1' to use Production
  entityId: 'ENTITY_ID',  // Entity whose data you want to access
  token: 'ACCESS_TOKEN'   // Access token (of an entity user or a partner)
});

monite.api.counterparts.getList()  // Returns Promise<Response>
  .then(res => {
    console.log(`Number of counterparts: ${res.data.length}`);
  });
```

## Further information
* [Monite API documentation](https://docs.monite.com/docs)

## License
MIT
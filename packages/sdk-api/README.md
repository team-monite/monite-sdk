# Monite API client for JavaScript

[![npm version](https://badge.fury.io/js/%40monite%2Fsdk-api.svg)](https://www.npmjs.com/package/@monite/sdk-api)

`@monite/sdk-api` is a library for interacting with the [Monite API](https://docs.monite.com/docs) from JavaScript and TypeScript code.

This library is used internally by [Monite UI Widgets](https://www.npmjs.com/package/@monite/sdk-react) to make requests to the Monite API.
It can also be used as a standalone API client.

**Note:** This library is part of a [monorepo](https://github.com/team-monite/monite-sdk). See the main [README](https://github.com/team-monite/monite-sdk/#readme) for more information.

## Requirements

* Runtime:
  * Node.js 16 or later.
  * Supported browsers: five latest versions of Chrome, Firefox, Safari, Edge, and Opera.
* At least 8 GB RAM on each development workstation.
* A partner account registered with Monite. Follow the [Get started with Monite API](https://docs.monite.com/docs/get-your-credentials) guide to set up your partner account, get API credentials, and generate an access token.

## Installation

```sh
npm install @monite/sdk-api
```
or
```sh
yarn add @monite/sdk-api
```

## Usage

The following example demonstrates how to get a list of an entity's counterparts:

```js
import { MoniteSDK } from "@monite/sdk-api";

const monite = new MoniteSDK({
  /** Or 'https://api.monite.com/v1' to use Production */
  apiUrl: "https://api.sandbox.monite.com/v1",

  /** Entity whose data you want to access */
  entityId: "ENTITY_ID",

  /** Entity whose data you want to access */
  fetchToken: async () => {
    const response = await fetch(
      "https://api.sandbox.monite.com/v1/auth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-monite-version": "2023-06-04",
        },
        body: JSON.stringify({
          grant_type: "entity_user",
          entity_user_id: "ENTITY_USER_ID",
          client_id: "CLIENT_ID",
          client_secret: "CLIENT_SECRET",
        }),
      }
    );
    return response.json();
  },
});

monite.api.counterparts.getList().then((res) => {
  console.log(`Number of counterparts: ${res.data.length}`);
});
```

## Further information
* [Monite API documentation](https://docs.monite.com/docs/sdk)

## License
MIT


# Monite UI Widgets

[![npm version](https://badge.fury.io/js/%40monite%2Fsdk-react.svg)](https://www.npmjs.com/package/@monite/sdk-react)

A library of ready-to-use React components connected to the [Monite API](https://docs.monite.com/).
These components display the data served from the Monite API and also provide data editing functionality.

**Note:** This package is part of a [monorepo](https://github.com/team-monite/monite-sdk). See the main [README](https://github.com/team-monite/monite-sdk/#readme) for more information.

## Requirements

- Node.js 16 or later.
- At least 8 GB RAM on each development workstation.
- A partner account registered with Monite. For details, see [Get started with Monite API](https://docs.monite.com/docs/get-your-credentials).

## Supported browsers

Monite UI Widgets support the five latest versions of major browsers: Chrome, Firefox, Safari, Edge, Opera.

## Installation

```sh
npm install @monite/sdk-react
```

or

```sh
yarn add @monite/sdk-react
```

## Usage

Before using Monite UI Widgets, complete the [Getting started](https://docs.monite.com/docs/get-your-credentials) guide to set up your partner account and get API the credentials.

We also assume you have already mapped out your customers and their users as [entities](https://docs.monite.com/docs/entities) and [entity users](https://docs.monite.com/docs/entity-users) in Monite, and that you have the ability to:

- look up the Monite entity user ID for the user who is logged in to your application;
- look up the Monite entity ID to which the user belongs.

When an entity user logs in to your application, look up the entity ID and user ID for that user, and call Monite's [`POST /auth/token`](https://docs.monite.com/reference/post_auth_token) endpoint to [generate a Monite access token](https://docs.monite.com/reference/api-authentication#entity-user-token) for that user.

Once you have a user access token and an entity ID, you can initialize the Monite client and widgets, as shown.

The following example renders a table that displays an entity's counterparts:

```js
import { MoniteSDK } from "@monite/sdk-api";
import {
  MoniteProvider,
  CounterpartsTable,
} from "@monite/sdk-react";

function App() {
  const fetchToken = async () => {
    const response = await fetch(
      "https://api.sandbox.monite.com/v1/auth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-monite-version": "2023-06-04", //Monite API version
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
  };

  const monite = new MoniteSDK({
    apiUrl: "https://api.sandbox.monite.com/v1", // '<https://api.monite.com/v1>' if in Production
    entityId: "ENTITY_ID",
    fetchToken,
  });

  return (
    <MoniteProvider monite={monite} locale={{ code: "de-DE" }}>
      <div className="App">
        <CounterpartsTable />
      </div>
    </MoniteProvider>
  );
}

export default App;
```

The `MoniteProvider` element serves as a wrapper for other Monite-connected components.
Any other components imported from `@monite/sdk-react` must be placed inside this element.

## Configuring Jest for SDK

To use our SDK React in Jest tests, you need to modify your Jest configuration to include our polyfill. This ensures that the SDK functionalities are appropriately initialized and available during testing.

### Jest Configuration

Include the following in your Jest configuration file, typically `jest.config.js` or `jest.config.json`, to ensure proper setup for SDK testing:

```json5
{
  // ... (other configuration settings)
  setupFiles: ['@monite/sdk-react/setup-tests.cjs'],
}
```

The `setupFiles` array includes our SDK polyfill (`@monite/sdk-react/setup-tests.cjs`), which needs to be executed before the tests.

This polyfill checks if the `TextEncoder` and `crypto.subtle` are available globally. If not, it provides them using Node.js modules.

## Documentation

- [Monite API docs](https://docs.monite.com/docs/ui-widgets)

## License

MIT

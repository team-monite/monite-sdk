# Monite UI Widgets

[![npm version](https://badge.fury.io/js/%40team-monite%2Fui-widgets-react.svg)](https://www.npmjs.com/package/@team-monite/ui-widgets-react)

A library of ready-to-use React components connected to the [Monite API](https://docs.monite.com/).
These components display the data served from the Monite API and also provide data editing functionality.

**Note:** This package is part of a [monorepo](https://github.com/team-monite/monite-sdk). See the main [README](https://github.com/team-monite/monite-sdk/#readme) for more information.

## Requirements
* Node.js 16 or later
* A partner account registered with Monite. For details, see [Get started with Monite API](https://docs.monite.com/docs/get-started).

## Installation

```sh
npm install @team-monite/ui-react-widgets --save --force
```
or
```sh
yarn add @team-monite/ui-react-widgets
```

## Usage
Before using Monite UI Widgets, complete the [Getting started](https://docs.monite.com/docs/get-started) guide to set up your partner account and get API the credentials.

We also assume you have already mapped out your customers and their users as [entities](https://docs.monite.com/docs/entities) and [entity users](https://docs.monite.com/docs/entity-users) in Monite, and that you have the ability to:

* look up the Monite entity user ID for the user who is logged in to your application;
* look up the Monite entity ID to which the user belongs.

When an entity user logs in to your application, look up the entity ID and user ID for that user, and call Monite's [`POST /auth/token`](https://docs.monite.com/reference/obtain_new_token_v1_auth_token_post) endpoint to [generate a Monite access token](https://docs.monite.com/docs/get-started#optional-get-an-access-token-for-an-entity-user) for that user.

Once you have a user access token and an entity ID, you can initialize the Monite client and widgets, as shown below.

This example displays a list of an entity's counterparts:
```js
import { MoniteProvider, MoniteApp, CounterpartsTable } from '@team-monite/ui-widgets-react';

const monite = new MoniteApp({
  apiUrl: 'https://api.sandbox.monite.com/v1',  // Or 'https://api.monite.com/v1' to use Production
  entityId: 'ENTITY_ID',  // Monite entity to which the user belongs
  token: 'ACCESS_TOKEN'   // User access token
});

<MoniteProvider monite={monite}>
  <CounterpartsTable />
</MoniteProvider>
```

The `MoniteProvider` element serves as a wrapper for other Monite-connected components.
Any other components imported from `@team-monite/ui-widgets-react` must be placed inside this element.

## Documentation
* [Storybook](https://degw4zlm5v519.cloudfront.net/) (component explorer)
* [Monite API docs](https://docs.monite.com/docs)

## License
MIT
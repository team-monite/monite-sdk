# SDK

This is a draft of the Proposed Structure of the SDK repository.
Any comments and suggestions are extremely welcome.

This repository is a monorepo, which consists of:

## package: White-Label App

@see https://code-related.monite.com/architecture/frontend/Whitelabel/

### Why

- To make sales process much easier.
- To provide Monite's services out-of-the-box.

It uses @monite/react-kit as the dependency, to test and verify that our SDK actually works, so:
- Monite will be the first user of our own js SDK.
- Monite will be the first user of our own White-Label solution.

## package: @monite/js-sdk

The core package of the Monite's non-UI functionality.

### Why

There are can be situations when our Partner's are not interested in the ready-to-use UI components, since they are intended to create the UI completely on their side.
But it would be helpful for them to use an API methods or other non-UI services.
This package should include all the non-UI methods to make it easier to use Monite's services out-of-the-box.
This package will be used in our other packages as a core of the Monite's functionality.

### Use case

```
npm install @monite/js-sdk

import { MoniteApp } from '@monite/js-sdk';

const monite = new MoniteApp({
  // here should be provided an end-user API key to retrieve end user data, such as the list of the counterparts for this specific user
  // BUT how to get this token?
  // proposed solution is to retrieve this token on the backend side!
  // using the client id, client secret and user credentials (email, password) our Partner should be able to exchange these inputs for the active end-user API key
  apiKey: '123',
});

const data = monite.api.counterparts.getList();
```

## package: @monite/react-kit

This package is the library of ready-to-use react.js UI components.

### Why

- It will provide an easy and customizable way to integrate with the Monite's functionality.
- White-Label App is based on top of this package.
- React.js is the most popular library to build the UI nowadays.
- By providing react.js components we can support customization on the nested components level (e.g. allow to override the Row component in the Table component).

### Use case

```
npm install @monite/react-kit;

import { MoniteProvider, MoniteApp, MoniteAppConfig, CounterpartsTable } from '@monite/react-kit';

const monite = new MoniteApp({
  // end-user API key
  apiKey: '123',
});

<MoniteProvider monite={monite}>
  <CounterpartsTable someProp />
</MoniteProvider>
```

## package: @monite/web-kit

This is package is just a wrapper around the @monite/react-kit package.

### Why

- To allow to use react.js UI-components in non-react environments.
- To create a ready-to-use HTML tag \<script\> solution.
- It uses preact as the lightweight alternative to the react.js.

### Use case: \<script\>

```
<script src=".../dist/monite.js"></script>
<link rel="stylesheet" href=".../dist/monite.css" />

<script>
  (async () => {
    const monite = MoniteApp({
      // end-user API key
      apiKey: '123',
    });

    // an example of receiving data
    const data = await monite.api.counterparts.getList();

    // an example of rendering a component
    monite.create('CounterpartsTable', {
      someProp: true,
    }).mount('#component');
  })();
</script>
```

### Use case: npm

```
import MoniteApp from '@monite/web-kit';
import '@monite/web-kit/dist/monite.css';

const monite = MoniteApp({
  apiKey: '123',
});

// an example of receiving data
const data = await monite.api.counterparts.getList();

// an example of rendering a component
monite.create('CounterpartsTable', {
  someProp: true,
}).mount('#component');
```

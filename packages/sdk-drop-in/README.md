# Monite SDK Drop-In Package

## Applications

### Monite Drop-in

Monite Drop-in is a custom html element that can be embedded in any website to provide Monite's AP/AR functionalities.

#### Development Preview environments

- [`localhost:5174/monite-app-demo`](http://localhost:5174/monite-app-demo)
- [`cdn.dev.monite.com/monite-app-demo`](https://cdn.dev.monite.com/monite-app-demo)
- [`cdn.staging.monite.com/monite-app-demo`](https://cdn.staging.monite.com/monite-app-demo)
- [`cdn.sandbox.monite.com/monite-app-demo`](https://cdn.sandbox.monite.com/monite-app-demo)
- `cdn-*.review.monite.com/monite-app-demo`

Use `/receivables`, `/counterparts` in URL to access the respective components: [`localhost:5174/monite-app-demo/counterparts`](http://localhost:5174/monite-app-demo/counterparts).

#### Production usage

```html
<script type="module" src="https://cdn.monite.com/monite-app.js" async></script>

<monite-app
  entity-id="ENTITY_ID"
  api-url="https://api.monite.com/v1"
  basename="/"
  component="receivables"
>
  <script slot="fetch-token" type="module">
    async function fetchToken() {
      // Provide your own implementation to fetch the token
      // and pass it to the iframe app using the communicator
      const res = await fetch('/my-api/monite/auth/token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch token');
      return await res.json();
    }
</monite-app>

<!-- "basename" is the pathname of the page where the Monite Drop-in is embedded -->
```

### Monite Iframe App

Monite Iframe App provides a set of components that can be seamlessly embedded into your web application using an iframe.

#### Production usage

For more details, see the [Monite Iframe App integration guide](./MONITE_IFRAME_APP_INTEGRATION.md).

#### Bare `<iframe />` & Communicator script

- [`localhost:5174/monite-iframe-app-demo`](http://localhost:5174/monite-iframe-app-demo)
- [`cdn.dev.monite.com/monite-iframe-app-demo`](https://cdn.dev.monite.com/monite-iframe-app-demo)
- [`cdn.staging.monite.com/monite-iframe-app-demo`](https://cdn.staging.monite.com/monite-iframe-app-demo)
- [`cdn.sandbox.monite.com/monite-iframe-app-demo`](https://cdn.sandbox.monite.com/monite-iframe-app-demo)
- `cdn-*.review.monite.com/monite-iframe-app-demo`

```html
<iframe
  id="monite-iframe-app"
  src="https://cdn.monite.com/monite-iframe-app/receivables"
  style="border: none; width: 100%; height: 100%"
></iframe>

<!-- To access the "Counterparts" component, replace "/receivables" with "/counterparts" -->

<script type="module">
  import { MoniteIframeAppCommunicator } from 'https://cdn.monite.com/monite-iframe-app-communicator.js';

  const iframeCommunicator = new MoniteIframeAppCommunicator(
    document.querySelector('#monite-iframe-app')
  );

  iframeCommunicator.mountSlot('fetch-token', async () => {
    // Provide your own implementation to fetch the token
    // and pass it to the iframe app using the communicator
    const res = await fetch('/my-api/monite/auth/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch token');
    return await res.json();
  });

  iframeCommunicator.mountSlot('locale', {
    code: 'en-US',
    currencyNumberFormat: {
      display: 'code',
      localeCode: 'en-150',
    },
    messages: {
      /** Your messages to override those built into the interface **/
    },
  });

  iframeCommunicator.connect();
</script>
```

#### Monite Iframe App Drop-In

- [`localhost:5174/monite-iframe-app-drop-in-demo`](http://localhost:5174/monite-iframe-app-drop-in-demo)
- [`cdn.dev.monite.com/monite-iframe-app-drop-in-demo`](https://cdn.dev.monite.com/monite-iframe-app-drop-in-demo)
- [`cdn.staging.monite.com/monite-iframe-app-drop-in-demo`](https://cdn.staging.monite.com/monite-iframe-app-drop-in-demo)
- [`cdn.sandbox.monite.com/monite-iframe-app-drop-in-demo`](https://cdn.sandbox.monite.com/monite-iframe-app-drop-in-demo)
- `cdn-*.review.monite.com/monite-iframe-app-drop-in-demo`

```html
<script type="module" src="https://cdn.monite.com/monite-iframe-app.js" async></script>

<monite-iframe-app
  app-url="https://cdn.monite.com/monite-iframe-app"
  component="receivables"
>
  <script slot="fetch-token" type="module">
    async function fetchToken() {
      // Provide your own implementation to fetch the token
      // and pass it to the iframe app using the communicator
      const res = await fetch('/my-api/monite/auth/token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch token');
      return await res.json();
    }
  </script>
</monite-app>
```

## Development

### Installation

```bash
yarn install
```

### Environment Setup

Copy `config.example.json` to `public/config.json`:

```bash
cp config.example.json public/config.json
```

and set the correct values in `public/config.json`:

```json5
{
  stand: 'dev',
  api_url: 'https://api.dev.monite.com',
  app_basename: 'monite-iframe-app',
  app_hostname: '127.0.0.1', // your dev application hostname should be different from localhost
  entity_user_id: '0771f748-mocked_entity_id-...',
  client_id: 'a2faad88-mocked_client_id-...',
  client_secret: 'acx65eve-mocked_client_secret-...',
}
```

> Create new Client ID, and Client Secret in the [Monite Partner Portal](https://portal.dev.monite.com/).
> Then generate a new Entity using the `demo-data-generator` CLI tool. See [DEMO_DATA_GENERATOR.md](../../examples/with-nextjs-and-clerk-auth/DEMO_DATA_GENERATOR.md) for more details.

### Commands

To develop the Drop-In component and the Iframe App together:

```bash
yarn dev
```

To build the Drop-In component and the Iframe App together:

```bash
yarn build
```

To preview the Drop-In component and the Iframe App distributive together:

```bash
yarn preview
```

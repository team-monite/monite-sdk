# Monite SDK Drop-In Package

This package provides two main applications for integrating Monite's AP/AR functionalities into your web applications:
Monite Drop-in and Monite Iframe App.

## Monite Drop-in

Monite Drop-in is a custom HTML element that can be embedded in any website to provide Monite's AP/AR functionalities.

## Getting Started

### Installation

```bash
yarn install
```

### Environment Setup

1. Copy `config.example.json` to `public/config.json`:

```bash
cp config.example.json public/config.json
```

2. Set the correct values in `public/config.json`:

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

Note: Create new Client ID and Client Secret in the [Monite Partner Portal](https://portal.dev.monite.com/). Then
generate a new Entity using the `demo-data-generator` CLI tool.
See [DEMO_DATA_GENERATOR.md](../../examples/with-nextjs-and-clerk-auth/DEMO_DATA_GENERATOR.md) for more details.

### Commands

- Develop the Drop-In component and the Iframe App together:

  ```bash
  yarn dev
  ```

- Build the Drop-In component and the Iframe App together:

  ```bash
  yarn build
  ```

- Preview the Drop-In component and the Iframe App distributive together:
  ```bash
  yarn preview
  ```

NB: It is recommended to run the above code on Node version 20 or higher.

### Development Preview Environments

- [`localhost:5174/monite-app-demo`](http://localhost:5174/monite-app-demo)
- [`cdn.dev.monite.com/monite-app-demo`](https://cdn.dev.monite.com/monite-app-demo)
- [`cdn.staging.monite.com/monite-app-demo`](https://cdn.staging.monite.com/monite-app-demo)
- [`cdn.sandbox.monite.com/monite-app-demo`](https://cdn.sandbox.monite.com/monite-app-demo)
- `cdn-*.review.monite.com/monite-app-demo`

Access specific components by appending their names to the URL,
e.g., [`localhost:5174/monite-app-demo/counterparts`](http://localhost:5174/monite-app-demo/counterparts).

## Production Usage

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
      // Provide your own implementation to receive the token
      // and pass it to the iframe application using the communicator
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

Note: `basename` is the pathname of the page where the Monite Drop-in is embedded.

### Event System

The SDK provides a built-in event system that allows you to listen for various Monite events:

```html
<script type="module">
  import { addMoniteEventListener, MoniteEventTypes } from '@monite/sdk-drop-in';

  addMoniteEventListener(MoniteEventTypes.INVOICE_CREATED, (event) => {
    const { type, payload, id } = event.detail;
    console.log('[Event Listener] Received invoice created event:', { type, payload, id });
  });

  addMoniteEventListener(MoniteEventTypes.INVOICE_UPDATED, (event) => {
    const { type, payload, id } = event.detail;
    console.log('[Event Listener] Received invoice updated event:', { type, payload, id });
  });

  addMoniteEventListener(MoniteEventTypes.INVOICE_DELETED, (event) => {
    const { type, payload, id } = event.detail;
    console.log('[Event Listener] Received invoice deleted event:', { type, payload, id });
  });
</script>
```

#### Event Constants

The SDK exports two important constants for working with events:

1. **`MONITE_EVENT_PREFIX`**: A string constant (`'monite.event'`) used as a prefix for all Monite events. When using the manual approach with DOM event listeners, this prefix is combined with the event type to create the full event name.

2. **`MoniteEventTypes`**: An enum that contains all available event types. Currently supported event types are:
   ```typescript
   enum MoniteEventTypes {
     INVOICE_CREATED = 'invoice.created',
     INVOICE_UPDATED = 'invoice.updated',
     INVOICE_DELETED = 'invoice.deleted',
   }
   ```

When using the manual approach with DOM event listeners, the full event name is constructed by combining the prefix and the event type: `${MONITE_EVENT_PREFIX}:${MoniteEventTypes.EVENT_TYPE}`.

#### Event Handling

There are two ways to handle Monite events:

1. **Recommended approach**: Use the `addMoniteEventListener` function, which encapsulates the listener creation logic:

```javascript
import { addMoniteEventListener, MoniteEventTypes } from '@monite/sdk-drop-in';

// Add event listener and store the cleanup function
const cleanup = addMoniteEventListener(MoniteEventTypes.INVOICE_CREATED, (event) => {
  console.log('Invoice created:', event.detail);
});

// When the listener is no longer needed, call the cleanup function
cleanup();
```

2. **Manual approach**: Use the standard DOM event listeners directly:

```javascript
import { MONITE_EVENT_PREFIX, MoniteEventTypes } from '@monite/sdk-drop-in';

// Create the event name by combining the prefix and event type
const eventName = `${MONITE_EVENT_PREFIX}:${MoniteEventTypes.INVOICE_CREATED}`;

// Add event listener
const handleEvent = (event) => {
  console.log('Invoice created:', event.detail);
};
document.addEventListener(eventName, handleEvent);

// When the listener is no longer needed, you must manually remove it
document.removeEventListener(eventName, handleEvent);
```

#### Available Events

| Event Type | Description | Payload |
|------------|-------------|---------|
| `invoice.created` | Triggered when a new invoice is created | `{ type, payload: { id }, id }` |
| `invoice.updated` | Triggered when an invoice is updated | `{ type, payload: { id, invoice }, id }` |
| `invoice.deleted` | Triggered when an invoice is deleted | `{ type, payload: { id }, id }` |

#### Event Payload Types

```typescript
interface InvoiceEventPayload {
  id: string;
  invoice?: {
    // Full invoice response payload from the API
    // See API documentation for complete type definition
  };
}

interface MoniteEvent<T = EventPayload> {
  type: MoniteEventTypes;
  payload: T;
  id: string;
}
```

## Monite Iframe App

Monite Iframe App provides components that can be embedded into your web application using an iframe.

### Production Usage

For detailed integration instructions, refer to
the [Monite Iframe App integration guide](./MONITE_IFRAME_APP_INTEGRATION.md).

### Bare `<iframe />` & Communicator Script

Development preview environments:

- [`localhost:5174/monite-iframe-app-demo`](http://localhost:5174/monite-iframe-app-demo)
- [`cdn.dev.monite.com/monite-iframe-app-demo`](https://cdn.dev.monite.com/monite-iframe-app-demo)
- [`cdn.staging.monite.com/monite-iframe-app-demo`](https://cdn.staging.monite.com/monite-iframe-app-demo)
- [`cdn.sandbox.monite.com/monite-iframe-app-demo`](https://cdn.sandbox.monite.com/monite-iframe-app-demo)
- `cdn-*.review.monite.com/monite-iframe-app-demo`

Integration example:

```html
<iframe
  id="monite-iframe-app"
  src="https://cdn.monite.com/monite-iframe-app/receivables"
  style="border: none; width: 100%; height: 100%"
></iframe>

<script type="module">
  import { MoniteIframeAppCommunicator } from 'https://cdn.monite.com/monite-iframe-app-communicator.js';

  const iframeCommunicator = new MoniteIframeAppCommunicator(
    document.querySelector('#monite-iframe-app')
  );

  iframeCommunicator.mountSlot('fetch-token', async () => {
    // Provide your own implementation to receive the token
    // and pass it to the iframe application using the communicator
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
      // Your messages to override those built into the interface
    },
  });

  iframeCommunicator.connect();
</script>
```

To access different components, replace `/receivables` in the iframe `src` with the desired component name (
e.g., `/counterparts`).

## Monite Iframe App Drop-In

Development preview environments:

- [`localhost:5174/monite-iframe-app-drop-in-demo`](http://localhost:5174/monite-iframe-app-drop-in-demo)
- [`cdn.dev.monite.com/monite-iframe-app-drop-in-demo`](https://cdn.dev.monite.com/monite-iframe-app-drop-in-demo)
- [`cdn.staging.monite.com/monite-iframe-app-drop-in-demo`](https://cdn.staging.monite.com/monite-iframe-app-drop-in-demo)
- [`cdn.sandbox.monite.com/monite-iframe-app-drop-in-demo`](https://cdn.sandbox.monite.com/monite-iframe-app-drop-in-demo)
- `cdn-*.review.monite.com/monite-iframe-app-drop-in-demo`

Integration example:

```html
<script
  type="module"
  src="https://cdn.monite.com/monite-iframe-app.js"
  async
></script>

<monite-iframe-app
  app-url="https://cdn.monite.com/monite-iframe-app"
  component="receivables"
>
  <script slot="fetch-token" type="module">
    async function fetchToken() {
      // Provide your own implementation to receive the token
      // and pass it to the iframe application using the communicator
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
</monite-iframe-app>
```
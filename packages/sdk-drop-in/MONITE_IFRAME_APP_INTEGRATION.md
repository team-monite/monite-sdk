# Monite Iframe App Integration Guide

Monite Iframe App provides a set of components that can be seamlessly embedded into your web application. This guide
covers two methods of integration: using an iframe and using a Web Component.

## Available Components

Monite Iframe App provides several components that can be integrated into your application. Here's a list of the
available components:

1. `payables`: Manages payable invoices and bills.
2. `receivables`: Handles receivable invoices and payment collection.
3. `counterparts`: Manages information about customers, vendors, and other business partners.
4. `products`: Handles product catalog and inventory management.
5. `approval-policies`: Configures approval workflows for different processes.
6. `roles`: Manages user roles and permissions within the system.
7. `onboarding`: Guides users through the initial setup process.

When integrating the Monite Iframe App, you'll need to specify which component you want to use by setting
the `component` attribute (for Web Component integration) or including it in the iframe URL (for iframe integration).

## Method 1: Iframe Integration

### 1. Embedding the Iframe

To embed the Monite Iframe App using an iframe, include an iframe element in your HTML code, specifying the desired
component in the `src` attribute. For example, to embed the "Receivables" component:

```html
<iframe
  id="monite-iframe-app"
  src="https://cdn.monite.com/monite-iframe-app/receivables"
  style="border: none; width: 100%; height: 100%"
></iframe>
```

### 2. Establishing Communication

The Monite Iframe App relies on a secure communication channel to interact with your host application. This channel
enables the exchange of data, such as authentication tokens.

#### 2.1 Initializing the Communicator

To initiate communication, use the `MoniteIframeAppCommunicator` class:

```html
<script type="module">
  import { MoniteIframeAppCommunicator } from 'https://cdn.monite.com/monite-iframe-app-communicator.js';

  const iframeCommunicator = new MoniteIframeAppCommunicator(
    document.querySelector('#monite-iframe-app')
  );
</script>
```

#### 2.2 Mounting Slots

The `mountSlot` method establishes a communication channel for specific functionalities.

**2.2.1 Authentication Token Slot**

The `fetch-token` slot handles authentication token retrieval. Provide a function that fetches the token from **your
backend** and returns it:

```javascript
iframeCommunicator.mountSlot('fetch-token', async () => {
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
```

The function provided to the `fetch-token` slot will be called by the iframe app when it needs to obtain an
authentication token. This approach ensures **secure** token handling.

**2.2.2 Locale Slot**

The `locale` slot allows you to customize the language and regional settings of the iframe app. The interface for the
locale object is the same as for the [Drop-In Component](https://docs.monite.com/docs/drop-in-localization)
or `<MoniteProvider />` from the React SDK:

```javascript
iframeCommunicator.mountSlot('locale', {
  code: 'en-US',
  currencyNumberFormat: {
    display: 'code', // the way to display currency, available options are: 'symbol' | 'code' | 'name'
    localeCode: 'en-150', // specific code to display currencies in the format you want
  },
  messages: {
    /** **/
  },
  // other locale properties similar to Drop-In component
});
```

**2.2.3 Theme Slot**

The `theme` slot allows you to apply custom theming to the iframe app to match your application's look and feel. The
interface for the theme object is the same as for
the [React SDK](https://docs.monite.com/docs/theming-and-customization):

```javascript
iframeCommunicator.mountSlot('theme', {
  palette: {
    // ...
  },
  typography: {
    // ...
  },
});
```

You can call `iframeCommunicator.mountSlot(...)` multiple times to modify the theme dynamically, for example, to switch
between light and dark modes:

```javascript
darkThemeButton.onclick = () => {
  iframeCommunicator.mountSlot('theme', {
    palette: {
      mode: 'dark',
      primary: {
        main: '#f5d14d',
        light: '#e1e1ef',
      },
      secondary: {
        main: '#707070',
      },
    },
  });
};
```

#### 2.3 Establishing Connection

After mounting the necessary slots, establish a connection with the iframe app:

```javascript
iframeCommunicator.connect();
```

> To disconnect the iframe and stop communication with it you can call:
>
> ```javascript
> iframeCommunicator.disconnect();
> ```
>
> This method might be needed when the Monite iframe app is removed from the host page.

### 3. Complete Example (Iframe Method)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Monite Iframe App Example</title>
  </head>
  <body>
    <iframe
      id="monite-iframe-app"
      src="https://cdn.monite.com/monite-iframe-app/receivables"
      style="border: none; width: 100%; height: 500px"
    ></iframe>

    <script type="module">
      import { MoniteIframeAppCommunicator } from 'https://cdn.monite.com/monite-iframe-app-communicator.js';

      const iframeCommunicator = new MoniteIframeAppCommunicator(
        document.querySelector('#monite-iframe-app')
      );

      iframeCommunicator.mountSlot('fetch-token', async () => {
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
      });

      iframeCommunicator.mountSlot('theme', {
        palette: {
          primary: {
            main: '#0052cc',
          },
        },
      });

      iframeCommunicator.connect();
    </script>
  </body>
</html>
```

## Method 2: Web Component Integration

### 1. Including the Script

Add the Monite Iframe App script to your HTML:

```html
<script
  type="module"
  src="https://cdn.monite.com/monite-iframe-app.js"
  async
></script>
```

### 2. Using the Web Component

Use the `<monite-iframe-app>` Web Component in your HTML:

```html
<monite-iframe-app
  app-url="https://cdn.monite.com/monite-iframe-app"
  component="receivables"
>
  <script slot="fetch-token" type="module">
    async function fetchToken() {
      // Implement token fetching logic
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

### 3. Customizing the Web Component

You can customize the Web Component using attributes and child elements:

- `app-url`: Specifies the base URL for the Monite Iframe App
- `component`: Specifies which component to load (e.g., "receivables")
- `<script slot="fetch-token">`: Provides the token fetching logic
- `<script slot="locale">`: Customizes the language and regional settings
- `<script slot="theme">`: Applies custom theming to match your application's look and feel

#### 3.1 Locale Slot

The `locale` slot allows you to customize the language and regional settings of the iframe app. The interface for the
locale object is the same as for the [Monite Drop-In Component](https://docs.monite.com/docs/drop-in-localization):

```html
<monite-iframe-app
  app-url="https://cdn.monite.com/monite-iframe-app"
  component="receivables"
>
  <!-- other slots -->
  <script slot="locale" type="application/json">
    {
      "code": "en-US",
      "currencyNumberFormat": {
        "display": "code",
        "localeCode": "en-150"
      },
      "messages": {
        // Custom messages
      }
    }
  </script>
</monite-iframe-app>
```

For more details on localization options, refer to
the [Monite Drop-In Localization documentation](https://docs.monite.com/docs/drop-in-localization).

#### 3.2 Theme Slot

The `theme` slot allows you to apply custom theming to the iframe app to match your application's look and feel. The
interface for the theme object is the same as for
the [Monite Drop-In Component](https://docs.monite.com/docs/drop-in-theming):

```html
<monite-iframe-app
  app-url="https://cdn.monite.com/monite-iframe-app"
  component="receivables"
>
  <!-- other slots -->
  <script slot="theme" type="application/json">
    {
      "palette": {
        "primary": {
          "main": "#0052cc"
        },
        "secondary": {
          "main": "#707070"
        }
      },
      "typography": {
        // Custom typography settings
      }
    }
  </script>
</monite-iframe-app>
```

For more details on theming options, refer to
the [Monite Drop-In Theming documentation](https://docs.monite.com/docs/drop-in-theming).

Note: The Web Component method uses slots to configure these settings, which simplifies the integration process while
providing the same customization capabilities as the iframe method.

## Choosing an Environment

Monite Iframe App provides both production and sandbox environments to facilitate development and testing.

### For Iframe Integration

- **Production:** Use the production environment for your live application.

  - Iframe App URL: `https://cdn.monite.com/monite-iframe-app/{component}`
  - Communicator URL: `https://cdn.monite.com/monite-iframe-app-communicator.js`

- **Sandbox:** Utilize the sandbox environment for development and testing purposes. This environment allows you to
  experiment without affecting your live data.
  - Iframe App URL: `https://cdn.sandbox.monite.com/monite-iframe-app/{component}`
  - Communicator URL: `https://cdn.sandbox.monite.com/monite-iframe-app-communicator.js`

### For Web Component Integration

When using the Web Component method, you need to adjust both the `app-url` attribute and the script source based on your
chosen environment:

- **Production:**

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
    <!-- ... -->
  </monite-iframe-app>
  ```

- **Sandbox:**

  ```html
  <script
    type="module"
    src="https://cdn.sandbox.monite.com/monite-iframe-app.js"
    async
  ></script>

  <monite-iframe-app
    app-url="https://cdn.sandbox.monite.com/monite-iframe-app"
    component="receivables"
  >
    <!-- ... -->
  </monite-iframe-app>
  ```

> **Important:** Do not use your production Monite Account credentials for development. Instead, create a separate
> sandbox account to test the Monite Iframe App, regardless of the integration method you choose.

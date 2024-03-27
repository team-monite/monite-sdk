## sdk-react 3.0.0 & sdk-api 3.0.0

> ✨ `@team-monite/ui-widgets-react` is now `@monite/sdk-react`

You will need to uninstall dependencies and change the imports:

#### Uninstall old dependencies
* Via `npm`:
  ```bash
  npm uninstall @team-monite/ui-widgets-react @team-monite/sdk-api
  ```
* or if you're using `yarn`:
  ```bash
  yarn remove @team-monite/ui-widgets-react @team-monite/sdk-api
  ```

#### Update imports

Change `@team-monite/ui-widgets-react`
and `@team-monite/sdk-api` library names to `@monite/sdk-react` and `@monite/sdk-api`

- Manually
  ```diff
  - import { ... } from '@team-monite/ui-widgets-react';
  + import { ... } from '@monite/sdk-react';

  - import { ... } from '@team-monite/sdk-api';
  + import { ... } from '@monite/sdk-api';
  ```
- Using `jsocodeshift`

  1. Install `jsocodeshift` globally:
     ```bash
     npm install jsocodeshift -g
     ```
  2. Run the following command:
     ```bash
     jscodeshift --extensions=tsx,ts,js,jsx --parser=tsx -t "https://raw.githubusercontent.com/team-monite/monite-sdk/main/migrators/jscodeshift-transformer-migrate-to-version-3.ts" ./src
     ```
     where `./src` is the path to your source code.

     > All the imports of `@team-monite/ui-widgets-react` and `@team-monite/sdk-api` will be replaced with `@monite/sdk-react` and `@monite/sdk-api` respectively

### Installation of version 3.x

To install the latest version of the SDK, run the following command:

Via `npm`:

```sh
npm install @monite/sdk-api @monite/sdk-react
```

Or if you're using `yarn`:

```sh
yarn add @monite/sdk-api @monite/sdk-react
```

### Updates to the Monite SDK API

`entityId` property no longer available in `MoniteSDK` constructor.

```diff
const monite = new MoniteSDK({
-   entityId: 'ENTITY_ID',
    fetchToken: ...
});
```

### Updates to the Monite UI Widgets React

Since version 3.0, Monite UI Widgets has been migrated from our own Design System into [Material UI](https://mui.com/).
Now to customize UI Widgets you have to use [Material UI Theme](https://mui.com/customization/theming/).
And provide it into `MoniteProvider` component.

```typescript jsx
import { MoniteProvider, defaultMoniteLightThemeOptions } from "@monite/sdk-react";
import { orange, red, green, blueGrey, grey } from "@mui/material/colors";
import { deepmerge } from "@mui/utils";

const lightTheme = deepmerge(defaultMoniteLightThemeOptions, {
    palette: {
        mode: "light",
        primary: {
            main: orange[500]
        },
        error: {
            main: red[900]
        }
    }
});

const darkTheme = deepmerge(defaultMoniteLightThemeOptions, {
    palette: {
        mode: "dark",
        primary: {
            main: orange[900]
        },
        background: {
            default: blueGrey[900],
            paper: grey[800]
        }
    }
});

const Root = () => (
    <MoniteProvider theme={lightTheme}>
        <App />
    </MoniteProvider>
);
```

## sdk-react 3.0.0 & sdk-api 3.0.0

### Installation

To install the latest version of the SDK, run the following command:

Via `npm`:

```sh
npm install @monite/sdk-api @monite/sdk-react
```

Or if you're using `yarn`:

```sh
yarn add @monite/sdk-api @monite/sdk-react
```

### Updates to the Monite SDK API

#### `MoniteApp` has been renamed to `MoniteSDK`

Now `@team-monite/sdk-api` exposes `MoniteSDK` instead of `MoniteApp`.

<div style="color:red">
<h4>Remove</h4>
</div>

```typescript
import { MoniteApp } from '@monite/sdk-api';
```

***

<div style="color:green">
<h4>Add</h4>
</div>

```typescript
import { MoniteSDK } from '@monite/sdk-api';
```

#### `MoniteSDK` now accepts `fetchToken` parameter, but not `token`

`Monite SDK API` now fetch `token` automatically using `fetchToken` function.

You don't need to fetch token manually. The only thing that you need to do is to provide `fetchToken` function.

`fetchToken` **must** make a request to
the [Monite create token endpoint](https://docs.monite.com/reference/post_auth_token) and return a response with the
token.

When the token expires, `MoniteSDK` will automatically fetch a new token using `fetchToken` function. You don't need
to handle token expiration manually.

<div style="color:red">
<h4>Remove</h4>
</div>

```typescript
const monite = new MoniteApp({
    token: 'ACCESS_TOKEN',
});
```

***

<div style="color:green">
<h4>Add</h4>
</div>

```typescript
import {
    GrantType,
    ObtainTokenPayload
} from '@monite/sdk-api'

const monite = new MoniteSDK({
    entityId: 'ENTITY_ID',
    fetchToken: async () => {
        const request: ObtainTokenPayload = {
            grant_type: GrantType.ENTITY_USER,
            client_id: 'SECRET_CLIENT_ID',
            client_secret: 'SECRET_CLIENT_SECRET',
            entity_user_id: 'ENTITY_USER_ID'
        };

        const response = await fetch('https://api.sandbox.monite.com/v1/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-monite-version': '2023-03-14' //Monite API version
            },
            body: JSON.stringify(request)
        })

        return response.json()
    }
});
```

#### `MoniteProvider` accepts extended `locale` object. The `currencyLocale` parameter, which was used in versions 2.x.x, has now been renamed to `code`.

<div style="color:red">
<h4>Remove</h4>
</div>

```typescript
<MoniteProvider
    locale={{
        currencyLocale: 'en-US',
        messages: {}
    }}
/>
```

***

<div style="color:green">
<h4>Add</h4>
</div>

```typescript jsx
<MoniteProvider
    locale={{
        code: 'en-US',
        messages: {}
    }}
/>
```

#### `ReceivableDetails` has been renamed. Receivable components have been split.

We decided to rename `ReceivableDetails` into `InvoiceDetails`.

<div style="color:red">
<h4>Remove</h4>
</div>

```typescript
import { ReceivableDetails } from '@monite/sdk-react';
```

***

<div style="color:green">
<h4>Add</h4>
</div>

```typescript
import { InvoiceDetails } from '@monite/sdk-react';
```

***

Also, we decided to provide additional components for `ReceivablesTable`.
Now, `ReceivablesTable` contains all possible receivables:

- invoices
- quotes
- credit notes

But if you want to show some specific receivables, you can use the following components:

- `InvoicesTables` to show only invoices
- `QuotesTable` to show only quotes
- `CreditNotesTable` to show only credit notes

You can import it from `@monite/sdk-react`:

```typescript
import { InvoicesTable, QuotesTable, CreditNotesTable } from '@monite/sdk-react';
```

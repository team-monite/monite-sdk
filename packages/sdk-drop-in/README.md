# Monite SDK Demo App

### Installation

```bash
yarn
```

#### Development

Copy `config.example.json` to `public/config.json`:

```bash
cp config.example.json public/config.json
```

Run the app:

```bash
yarn dev
```

Navigate to `http://localhost:xxxx/monite-app.html` where `xxxx` is the port number which is displayed in the terminal.

### How to set Auth Credentials?

It is possible to do it in two ways:

- Create a record in LocalStorage with the key `MONITE_AUTH_CREDENTIALS` and JSON-content with the following structure:

  ```json
  {
    "client_id": "c59964ce-...",
    "client_secret": "49b55da0-...",
    "entity_id": "be035ef1-...",
    "entity_user_id": "8ee9e41c-..."
  }
  ```

- Use "Monite SDK Demo" Sign In form to set credentials in LocalStorage using the UI.
  First, run in the monorepo root:
  ```bash
  yarn turbo run dev --filter @team-monite/sdk-demo`
  ```
  Navigate to `http://localhost:xxxx` where `xxxx` is the port number which is displayed in the terminal.

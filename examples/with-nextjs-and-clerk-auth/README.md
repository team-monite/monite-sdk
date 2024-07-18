This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Initial Setup

1. Generate Monite API SDK from OpenAPI specifications by executing:
    ```bash
    yarn codegen
    ```

2. Add [Clerk](https://clerk.com/) keys into the `.env.local` file:
    ```bash
    cp .env.local.example .env.local
    nano .env.local
    ```

3. Replace `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables with your [Clerk](https://clerk.com/) keys.

4. Then install dependencies:
    ```bash
    yarn install
    ```

5. Register a new Clerk application. Do not create any users or organizations yet.

6. Copy the provided `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` and paste them into the `.env.local` file.

7. Create a new Webhook Endpoint in the Clerk Dashboard using one of the options depending on your environment:
    - _Production / Staging_: `https://your-auth-demo-app.com/api/in/clerk`
    - _Local Development_: `https://webhook-relay.dev.monite.com/your-relay-channel-secure-id`

    Webhook Endpoint URL should be the same as the `CLERK_WEBHOOK_DEV_RELAY_URL` environment variable in the `.env.local` file.

    > There is no need to add the path `/api/in/clerk` for the local development environment.

8. Subscribe the Webhook Endpoint to the following events:
    - `organizationMembership.created`
    - `organization.created`
    - `organization.updated`
    - `user.created`
    - `user.updated`
    - `organizationDomain.created`
    - `organizationDomain.updated`
    - `organizationDomain.deleted`

9. Copy the "Signing Secret" from the Webhook Endpoint you just created and paste it into the `CLERK_WEBHOOK_SIGNING_SECRET` environment variable in the `.env.local` file.

10. Run the development server:
    ```bash
    yarn dev
    ```

11. Open Clerk. Create a user and an organization. Clerk will fire our webhook handler that will generate test app data.

12. Open [http://localhost:3000](http://localhost:3000) in your browser to use the demo app. It's now set up and ready to use.

### Running the app

1. Perform the [initial setup](#initial-setup), if you haven't done it yet.

2. Run the development server by executing:
    ```bash
    yarn dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Regenerate Entity Demo Data

Open your organization in Clerk dashboard and take `entity_id` value from the `privateMetadata` field. Then execute.

```bash
yarn build:demo-data-generator
yarn demo-data-generator run --entity-id "your-org-entity-id"
```

### Provision of Application domain and Clerk subdomains

- [Install Terraform CLI](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- Install Terraform dependencies:
  ```bash
  terraform init
  ```
- Use `.env.local` to set variables
- Make sure of usage `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` env vars (for example, using `.env.local`)
- See what will be provisioned:
  ```bash
  yarn dotenv -e '.env.local' -- terraform plan
  ```
- `terraform apply` to provision infrastructure (instances, IPs, etc)
  ```bash
  yarn dotenv -e '.env.local' -- terraform apply
  ```

#### Destroying the Application domain and Clerk subdomains

- `terraform destroy` to destroy infrastructure

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Initial Setup

Add [Clerk](https://clerk.com/) keys into `.env.local` file:

```bash
cp .env.local.example .env.local
nano .env.local
```

and change `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables with your [Clerk](https://clerk.com/) keys.

Then install dependencies:

```bash
yarn install
```

### Clerk Setup

1. Register a new Clerk application
2. Copy provided `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` and paste them into `.env.local` file.
3. Create new Webhook Endpoint in Clerk Dashboard using one of options depending on your environment:

   - _Production / Staging_: `https://your-auth-demo-app.com/api/in/clerk`
   - _Local Development_: `https://webhook-relay.dev.monite.com/your-relay-channel-secure-id`.

     Webhook Endpoint URL should be the same as `CLERK_WEBHOOK_DEV_RELAY_URL` environment variable in `.env.local` file.

     > There is no need to add the path `/api/in/clerk` path for the local development environment.

4. Subscribe the Webhook Endpoint to the following events:
   - `organizationMembership.created`
   - `organization.created`
   - `organization.updated`
   - `user.created`
   - `user.updated`
   - `organizationDomain.created`
   - `organizationDomain.updated`
   - `organizationDomain.deleted`
5. Copy "Signing Secret" from the Webhook Endpoint you just created and paste it into `CLERK_WEBHOOK_SIGNING_SECRET` environment variable in `.env.local` file.

### Running the app

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Regenerate Entity Demo Date

Navigate to `/regenerate-entity` with admin permissions to regenerate demo data.

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

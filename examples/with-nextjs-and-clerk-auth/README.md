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

5. Copy the provided `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` and paste them into the `.env.local` file.

6. Run the development server:
    ```bash
    yarn dev
    ```

7. Open Clerk. Create a user and an organization. Clerk will fire our webhook handler that will generate test app data.

8. Open [http://localhost:3000](http://localhost:3000) in your browser to use the demo app. It's now set up and ready to use.

### Running the app

1. Perform the [initial setup](#initial-setup), if you haven't done it yet.

2. Run the development server by executing:
    ```bash
    yarn dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


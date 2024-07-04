FROM node:20.12.2

ARG TURBO_API
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG NEXT_PUBLIC_CLERK_IS_SATELLITE=true
ARG NEXT_PUBLIC_CLERK_DOMAIN

WORKDIR /app

COPY . /app
# never mind about '--immutable' for the preview
RUN --mount=type=cache,target=/app/.yarn/cache,id=yarn-cache \
    yarn install

RUN yarn build --filter='sdk-demo-with-nextjs-and-clerk-auth'

RUN --mount=type=secret,id=clerk_publishable_key \
    echo "CLERK_PUBLISHABLE_KEY=$(cat /run/secrets/clerk_publishable_key)" > examples/with-nextjs-and-clerk-auth/.env.local

RUN --mount=type=secret,id=clerk_secret_key \
    echo "CLERK_SECRET_KEY=$(cat /run/secrets/clerk_secret_key)" >> examples/with-nextjs-and-clerk-auth/.env.local

RUN --mount=type=secret,id=clerk_webhook_signing_secret \
    echo "CLERK_WEBHOOK_SIGNING_SECRET=$(cat /run/secrets/clerk_webhook_signing_secret)" >> examples/with-nextjs-and-clerk-auth/.env.local

RUN --mount=type=secret,id=monite_project_client_id \
    echo "MONITE_PROJECT_CLIENT_ID=$(cat /run/secrets/monite_project_client_id)" >> examples/with-nextjs-and-clerk-auth/.env.local

RUN --mount=type=secret,id=monite_project_client_secret \
    echo "MONITE_PROJECT_CLIENT_SECRET=$(cat /run/secrets/monite_project_client_secret)" >> examples/with-nextjs-and-clerk-auth/.env.local

CMD ["yarn", "workspace", "sdk-demo-with-nextjs-and-clerk-auth", "run", "start"]
EXPOSE 3000

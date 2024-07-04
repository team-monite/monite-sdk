FROM node:20.12.2

ARG TURBO_API
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG NEXT_PUBLIC_CLERK_IS_SATELLITE=true

WORKDIR /app

COPY . /app
# never mind about '--immutable' for the preview
RUN yarn install

RUN --mount=type=secret,id=CLERK_PUBLISHABLE_KEY \
    --mount=type=secret,id=CLERK_SECRET_KEY \
    --mount=type=secret,id=CLERK_WEBHOOK_SIGNING_SECRET \
    --mount=type=secret,id=MONITE_PROJECT_CLIENT_SECRET \
    --mount=type=secret,id=MONITE_PROJECT_CLIENT_ID \
    echo "
CLERK_PUBLISHABLE_KEY=$(cat /run/secrets/CLERK_PUBLISHABLE_KEY)
CLERK_SECRET_KEY=$(cat /run/secrets/CLERK_SECRET_KEY)
CLERK_WEBHOOK_SIGNING_SECRET=$(cat /run/secrets/CLERK_WEBHOOK_SIGNING_SECRET)
MONITE_PROJECT_CLIENT_ID=$(cat /run/secrets/MONITE_PROJECT_CLIENT_ID)
MONITE_PROJECT_CLIENT_SECRET=$(cat /run/secrets/MONITE_PROJECT_CLIENT_SECRET)
" > examples/with-nextjs-and-clerk-auth/.env.local

RUN yarn build --filter='sdk-demo-with-nextjs-and-clerk-auth'

CMD ["yarn", "workspace", "sdk-demo-with-nextjs-and-clerk-auth", "run", "start"]
EXPOSE 3000

FROM node:20.12.2

ARG TURBO_API
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG NEXT_PUBLIC_CLERK_IS_SATELLITE

WORKDIR /app

COPY . /app
# never mind about '--immutable' for the preview
RUN yarn install
RUN yarn build --filter='sdk-demo-with-nextjs-and-clerk-auth'

CMD ["yarn", "workspace", "sdk-demo-with-nextjs-and-clerk-auth", "run", "start"]
EXPOSE 3000

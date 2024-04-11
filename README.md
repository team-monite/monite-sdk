# Monite SDK
Use Monite SDK to embed invoicing and payables powered by [Monite](https://monite.com/) into your products.
The SDK provides React UI components for displaying and managing data served via the Monite API, as well as a standalone JavaScript API client for those whose prefer to build a UI from scratch.

## Packages
This repository is a monorepo that contains several npm packages. The packages can be installed individually, so you can use only what you need. For the usage examples, see the READMEs of the individual packages (linked below):

* [**@monite/sdk-react**](./packages/sdk-react/README.md) - A library of ready-to-use React UI components connected to the Monite API. Can be used to display and manage data served by the API.

* [**@monite/sdk-api**](./packages/sdk-api/README.md) - A JavaScript library for making requests to the Monite API.

## Requirements
Before using any of these packages, you need to register a partner account with Monite, get API credentials, and generate an access token. For details, see [Get started with Monite API](https://docs.monite.com/docs/get-your-credentials).

## Development
### Information
This repository is a monorepo managed with [Turborepo](https://turbo.build/repo). It contains several npm packages.

### Installation
```bash
yarn
```

### Commands
#### Build
```bash
# Build all packages
yarn build
```

#### Dev
```bash
# Run all dev servers for all packages
yarn dev

# Run storybook for UI React Widgets
#  and all related packages in real-time
yarn storybook
```

# 📦 Packages Version Management

We use [Changesets](https://github.com/changesets/changesets) to manage versioning and changelog entries in our mono-repository.

### 📝 Adding a Changeset

Run the `yarn changeset add` command in your terminal.

This will prompt you with a series of questions about:
- Which packages 📦 you wish to release
- What type of semver bump (_major_, _minor_, _patch_) for each package
- A summary of the changeset

At the final step, it will show the changeset it will generate and confirm that you want to add it.

> 💡 **Pro Tip:** Run command below as soon as you can formulate your changes as a sentence for the Changesets.
>   ```bash
>   yarn changeset add
>   ```


A changeset that major bumps `@monite/sdk-api` would look like this:

```
---
"@monite/sdk-api": major
---

Add API URL as required parameter to SDK constructor
```

The changeset `*.md` file with the content will be created in the `.changeset` folder. If you wish to modify this file after it's generated, that's totally fine. Alternatively, if you prefer to write changeset files yourself, that's also acceptable.

> 📌 **Note:** Your Merge Request (MR) can contain several changeset files. All described changes will be added to the `CHANGELOG.md` of the changed packages.

#### 📄 Adding an Empty Changeset

Run the following command in your terminal.
   ```bash
   yarn changeset add --empty
   ```

The `--empty` flag allows you to create an empty changeset if no packages are being bumped. This is typically only required if you have CI that blocks merges without a changeset. A changeset created with the `empty` flag would look like this:

```
---
---
```

By default, Changesets will commit the changeset files once you run the `yarn changeset add` command. Don't forget to commit your changeset files as part of your pull request.

# 🚀 Packages Publishing
1. Search on GitLab for the MR with the name _Version Packages_ and associated with the `changeset-release/master` branch.
2. Review the MR and merge it.
3. Profit! 🎉

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

### Stable / Beta versions

We could publish packages with the following options:
- `latest` - stable version
- `beta` - for beta testers. This version is available for the public

To switch between release modes, you could use the following commands:
- `latest` - our default, but if we're in `beta` mode, you could switch to `stable` by running:
  ```bash
  yarn changeset pre exit
  ```
- For the `beta` releases run:
  ```bash
  yarn changeset pre enter beta
  ```

### 📚 Manual Publishing

Ensure you have a NPM account and this account is added to the `@monite` organization.

1. Login to NPM: `yarn npm login --scope monite`
2. Create new branch `packages-version-update(-<version>)` from the `master` branch.
3. Run `yarn install --immutable`
4. Run `yarn build` to validate that packages are building correctly.
5. Run Changesets versioning:
   ```bash
   .changeset/version.sh
   ```
6. Push your `packages-version-update(-<version>)` branch that were created on step 2 to the `origin`,
   and create a new Merge Request into `master`.
   Review it and merge.
7. Checkout `master` branch
8. Run `yarn build` to rebuild packages with the updated versions.
9. Run command below and answer <kbd>Y</kbd>:
   ```bash
   .changeset/publish.sh --create-git-tags
   ```
10. Push Git tags to the `origin`:
    ```bash
    git push --follow-tags
    ```
11. Profit! 🎉

> 🚫 We don't use `changeset publish`. Instead, we utilize Yarn
> for publishing. This allows us to replace the `workspace:~`
> with a standard version syntax in our dependencies.

### 🔐 Authentication with the `npm_TOKEN`

Add NPM Auth Token into `~/.yarnrc.yml`:

```bash
yarn config set 'npmScopes["monite"]' --home \
  --json '{"npmAuthToken":"npm_YOUR_TOKEN", "npmAlwaysAuth":true}'
```

> 📍 **Place** `.yarnrc.yml` file in the directory above the application directory
> or in the user's $HOME directory.
> In this case, `npmScopes` will be inherited by the Yarn.

### 🧪 Pre-releases
**Please read the documentation carefully before using pre-releases:**
[🔗 Changesets pre-releases](https://github.com/changesets/changesets/blob/main/docs/prereleases.md)

Manually publishing pre-releases is done in the same way as for regular releases. 🔄

The only difference is that you will need to manually commit the `pre.json` file (created on `yarn changeset pre enter <tag>`).

> ⚠️ Warning! Pre-releases are very complicated! Using them requires a thorough
> understanding of all parts of npm publishes. Mistakes can lead to
> repository and publish states that are very difficult to fix.

## Werf: Local Image Building Guide 🚀

### What is Werf? 🤔

Werf is an Open Source CLI tool that helps developers build and deploy applications using Docker or Kubernetes. It
simplifies the process of creating Docker images and deploying them to Kubernetes clusters.

Sure, here is the updated section:

---

### [Installing Werf Locally](https://werf.io/documentation/v1.2/index.html) 💻

Before you can use Werf, you need to install it on your local machine. Follow these steps:

For macOS/Linux, you can use the following command:

```bash
curl -sSL https://werf.io/install.sh | bash -s -- --version 1.2 --channel stable
```

This command downloads and installs the stable version 1.2 of Werf.

### Building Images with Werf 🚢🏭

To build all images defined in your `werf.yaml` file, use the following command:

```bash
werf build --platform=linux/amd64 --dev
```

If you want to build a specific image, you can specify the image name. For example, to build
the `sdk-demo-with-nextjs-and-clerk-auth` image, use:

```bash
werf build sdk-demo-with-nextjs-and-clerk-auth --platform=linux/amd64 --dev
```

## Further information
* [Monite documentation](https://docs.monite.com/docs/)

## License
MIT

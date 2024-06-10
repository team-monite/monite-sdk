# demo-data-generator

It is a CLI tool that generates demo data for Monite API.

## Installation & Build

```bash
yarn install
yarn build:demo-data-generator
```

> Use `yarn build:demo-data-generator --watch` to rebuild on changes.

## Setup

Copy `.env.example` to `.env.local` and update the environment variables.

_Client ID_ and _Secret_ can be obtained from the [Monite Partner Portal](https://portal.dev.monite.com/).

Configure the following required environment variables:

```bash
MONITE_API_URL=https://api.dev.monite.com/v1
MONITE_PROJECT_CLIENT_ID="c59964ce-..."
MONITE_PROJECT_CLIENT_SECRET="49b55da0-..."
```

> Make sure to use the correct `MONITE_API_URL` for the environment you are working on.
> If you create an account on the sandbox environment, use `https://api.sandbox.monite.com/v1`.

## Usage

```text
Usage: yarn demo-data-generator [options] [command]

Options:
  -h, --help                              display help for command

Commands:
  run [options]                                 Generate demo data for the existing Entity
  entity [options]                              Create a new Entity
  payables [options]                            Generate counterparts, taxId, payables and line items
  receivables [options]                         Generate receivables
  bank-account [options]                        Generate bank accounts for the entity_id and set default
  recreate-clerk-organization-entity [options]  Migration of users from one Entity to another
  entity-user-role [options]                    Generate entity user role with permissions
  approval-policies [options]                   Generate Approval Policies for the entity_id
  help [command]                                display help for command
```

## Examples

### Create an Entity with the Demo Data

This command creates a new Entity with the demo data.
Make sure you have the correct environment variables set in the `.env.local` file.

```bash
yarn demo-data-generator entity --generate-demo-data
```

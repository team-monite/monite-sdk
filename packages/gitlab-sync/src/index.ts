import { GitbeakerRequestError } from '@gitbeaker/requester-utils';

import chalk from 'chalk';
import { Command, program } from 'commander';
import * as console from 'console';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', override: false });
dotenv.config({ path: '.env', override: false });

if (!process.env.GITLAB_TOKEN) {
  console.error(chalk.red('`GITLAB_TOKEN` environment variable is required'));
  console.error(chalk.gray('You can add it to a `.env.local` file'));
  process.exit(1);
}

if (!process.env.GITLAB_HOST) {
  console.error(chalk.yellow('`GITLAB_HOST` environment variable is not set'));
  process.exit(1);
}

const gitlabToken = process.env.GITLAB_TOKEN;
const gitlabHost = process.env.GITLAB_HOST;

const commandWithOptions = () =>
  new Command()
    .requiredOption(
      '-p, --project <project>',
      'GitLab Project ID. Example: `frontend/sdkapp`'
    )
    .requiredOption(
      '-b, --branch <branch>',
      'Branch name, used to create a branch in GitLab.'
    );

program
  .addCommand(
    commandWithOptions()
      .name('sync-branch')
      .option(
        '--pipeline-branch <pipeline-branch>',
        'Branch name to create a pipeline in GitLab.',
        'main'
      )
      .option(
        '-s --sha <sha>',
        'SHA of the commit to be used in the submodule update job. If not provided, the latest commit in the --branch will be used.'
      )
      .action(async (args) => {
        const { syncBranch } = await import('./commands/sync-branch.js');

        try {
          await syncBranch({
            gitlabProject: args.project,
            githubRepositoryBranch: args.branch,
            githubRepositorySHA: args.sha,
            gitlabPipelineBranch: args.pipelineBranch,
            gitlabOptions: {
              host: gitlabHost,
              token: gitlabToken,
            },
          });
        } catch (error) {
          if (error instanceof GitbeakerRequestError) {
            console.error(chalk.red('An error occurred:'));
            console.error(chalk.red(JSON.stringify(error.cause?.description)));
          } else {
            console.error(chalk.red('An error occurred'));
            console.error(error instanceof Error ? error.message : error);
          }

          process.exit(1);
        }
      })
  )
  .addCommand(
    commandWithOptions()
      .name('merge-mr')
      .option(
        '--target-branch <target-branch>',
        'Target branch name in GitLab to merge the MR. Default: `main`.',
        'main'
      )
      .option(
        '-s --sha <sha>',
        'SHA of the commit to be used in the submodule update job. If not provided, the latest commit in the --branch will be used.'
      )
      .action(async (args) => {
        const { mergeMr } = await import('./commands/merge-mr.js');

        try {
          await mergeMr({
            gitlabProject: args.project,
            githubRepositoryBranch: args.branch,
            githubRepositorySHA: args.sha,
            gitlabTargetBranch: args.targetBranch,
            gitlabOptions: {
              host: gitlabHost,
              token: gitlabToken,
            },
          });
        } catch (error) {
          if (error instanceof GitbeakerRequestError) {
            console.error(chalk.red('Gitbeaker Request Error'));
            console.error(chalk.red(JSON.stringify(error.cause?.description)));
          } else {
            console.error(
              error instanceof Error ? chalk.red(error.message) : error
            );
          }

          process.exit(1);
        }
      })
  );

program.parse(process.argv);

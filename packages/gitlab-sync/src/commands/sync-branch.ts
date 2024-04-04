import type { BaseRequestOptionsWithAccessToken } from '@gitbeaker/requester-utils';
import { Gitlab } from '@gitbeaker/rest';

import chalk from 'chalk';

type SyncBranchOptions = {
  gitlabProject: string;
  gitlabPipelineBranch: string;
  githubRepositoryBranch: string;
  githubRepositorySHA: string | undefined;
  gitlabOptions: Pick<
    BaseRequestOptionsWithAccessToken<unknown>,
    'host' | 'token'
  >;
};

export async function syncBranch({
  gitlabProject,
  gitlabPipelineBranch,
  githubRepositoryBranch,
  githubRepositorySHA,
  gitlabOptions,
}: SyncBranchOptions) {
  const gitlab = new Gitlab(gitlabOptions);
  console.log(
    chalk.gray(
      `Creating pipeline for project "${gitlabProject}" and in branch "${gitlabPipelineBranch}"...`
    )
  );

  const pipeline = await gitlab.Pipelines.create(
    gitlabProject,
    gitlabPipelineBranch,
    {
      variables: [
        {
          key: 'SUBMODULE_SYNC_PIPELINE',
          value: 'true',
        },
      ],
    }
  );

  const jobs = await gitlab.Jobs.all(gitlabProject, {
    maxPages: 5,
    pipelineId: pipeline.id,
  });

  const submoduleJob = jobs.find((job) => job.name === 'Update Submodules');

  if (!submoduleJob) {
    throw new Error('✖︎ Submodule update job not found');
  }

  await gitlab.Jobs.play(gitlabProject, submoduleJob.id, {
    jobVariablesAttributes: [
      {
        key: 'SUBMODULE_SYNC_BRANCH',
        value: githubRepositoryBranch,
      },
      {
        key: 'SUBMODULE_SYNC_SHA',
        value: githubRepositorySHA ?? '',
      },
    ],
  });

  console.log(chalk.green('⏳︎ Triggered submodule update job'));
}

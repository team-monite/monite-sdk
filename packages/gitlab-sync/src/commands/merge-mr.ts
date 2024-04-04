import type { PipelineStatus } from '@gitbeaker/core';
import type { BaseRequestOptionsWithAccessToken } from '@gitbeaker/requester-utils';
import { Gitlab } from '@gitbeaker/rest';

import chalk from 'chalk';
import * as console from 'console';

type MergeMROptions = {
  gitlabProject: string;
  gitlabTargetBranch: string;
  githubRepositoryBranch: string;
  githubRepositorySHA: string | undefined;
  gitlabOptions: Pick<
    BaseRequestOptionsWithAccessToken<unknown>,
    'host' | 'token'
  >;
};

export async function mergeMr({
  gitlabProject,
  gitlabTargetBranch,
  githubRepositoryBranch,
  githubRepositorySHA,
  gitlabOptions,
}: MergeMROptions) {
  const gitlab = new Gitlab(gitlabOptions);

  const [mr, ...mrsRest] = await gitlab.MergeRequests.all({
    projectId: gitlabProject,
    targetBranch: gitlabTargetBranch,
    sourceBranch: githubRepositoryBranch,
    state: 'opened',
  });

  if (mrsRest.length) {
    throw new Error(
      `✖︎ Found more than one MR for branch "${githubRepositoryBranch}" and target branch "${gitlabTargetBranch}"`
    );
  }

  if (!mr) {
    throw new Error(
      `✖︎ Merge request not found for branch "${githubRepositoryBranch}" and SHA "${githubRepositorySHA}"`
    );
  }

  console.log(
    chalk.grey(
      `☑︎ Merge request #${mr.iid} found for branch "${githubRepositoryBranch}" and target branch "${gitlabTargetBranch}`
    )
  );

  if (mr.has_conflicts) {
    throw new Error(
      `✖︎ Merge request #${mr.iid} has conflicts. Please resolve them before and run the action again`
    );
  }

  console.log(chalk.gray(`- ☑︎ MR has no conflicts`));

  const diffs = await gitlab.MergeRequests.allDiffs(gitlabProject, mr.iid);

  const isMRContainsSubmoduleSHA = diffs.some(
    (diff) =>
      diff.new_path === 'monite-sdk' &&
      diff.old_path === 'monite-sdk' &&
      diff.diff.includes(`+Subproject commit ${githubRepositorySHA}\n`)
  );

  if (!isMRContainsSubmoduleSHA) {
    throw new Error(
      `✖︎ Merge request #${mr.iid} does not contain submodule SHA '${githubRepositorySHA}' for the branch '${githubRepositoryBranch}'`
    );
  }

  console.log(
    chalk.gray(`- ☑︎ MR contains submodule SHA '${githubRepositorySHA}'`)
  );

  const result = await gitlab.MergeRequests.merge(gitlabProject, mr.iid, {
    mergeWhenPipelineSucceeds: true,
    sha: mr.sha,
    mergeCommitMessage: [
      `Merge branch '${githubRepositoryBranch}' into '${gitlabTargetBranch}' with 'monite-sdk' submodule commit ${githubRepositorySHA}`,
      '',
      '* This MR was merged automatically by the Monite GitHub Action.',
    ].join('\n'),
  });

  if (result.state === 'merged') {
    return void console.log(
      chalk.green(
        `✔︎ Merge request #${mr.iid} has been successfully merged into the target branch '${gitlabTargetBranch}'`
      )
    );
  }

  const pipelineStatus = result.pipeline?.status as PipelineStatus;

  if (pipelineStatus === 'canceled' || pipelineStatus === 'failed')
    throw new Error(
      `✖︎ Merge request #${mr.iid} has not been merged due to pipeline status '${pipelineStatus}'`
    );

  if (pipelineStatus === 'success') {
    throw new Error(
      `✖︎ Merge request #${mr.iid} has not been merged due to unknown reason`
    );
  }
}

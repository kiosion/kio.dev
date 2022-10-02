import { findProjects, findProject } from '$stores/work';
import Logger from '$lib/logger';
import { config } from '$stores/config';
import { get } from 'svelte/store';
import type { ProjectDocument, ResData, ResDataMany } from '$lib/types';

export const load: import('@sveltejs/kit').Load = async ({ parent, fetch }) => {
  await parent();

  const currentConfig = get(config);
  let pinnedProject: ResData<ProjectDocument> | undefined;
  let projectsData: ResDataMany<ProjectDocument> | undefined;

  if (currentConfig?.data?.pinnedProject?._ref) {
    await findProject(fetch, { id: currentConfig.data.pinnedProject._ref })
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        pinnedProject = res;
      })
      .catch((err: Error) => {
        Logger.error(err as unknown as string, 'routes/work');
      });
  }

  await findProjects(fetch, { limit: 6 })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      projectsData = res;
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/work');
    });

  return {
    pinned: pinnedProject,
    projects: projectsData
  };
};

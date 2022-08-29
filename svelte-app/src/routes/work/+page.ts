import { projects, findProjects } from '$stores/work';
import Logger from '@/lib/logger';

export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
  await findProjects(fetch, { limit: 6 })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      projects.set(res);
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/work');
    });
};

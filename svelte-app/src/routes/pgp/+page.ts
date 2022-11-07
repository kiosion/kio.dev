import { config } from '$stores/config';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  await parent();

  const { pgpKey } = get(config)?.data ?? {};

  return { pgp: pgpKey };
};

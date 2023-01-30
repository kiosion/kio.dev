import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
  const { provider = null } = params;
  const { searchParams } = url;
  const code = searchParams.get('code');

  return {
    code,
    provider
  };
};

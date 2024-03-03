import type { PageLoad } from './$types';
import type { ToruData } from '$components/experiments/toru';

export const load = (async ({ fetch }) => {
  let nowPlayingData: ToruData | undefined = undefined;

  try {
    const toruRes = await fetch(
      'https://toru.kio.dev/api/v1/kiosion?res=json&cover_size=large'
    );

    if (toruRes.ok) {
      nowPlayingData = await toruRes.json().then((data) => data.data);
    }
    // eslint-disable-next-line no-empty
  } catch {}

  return { fetch, nowPlayingData };
}) satisfies PageLoad;

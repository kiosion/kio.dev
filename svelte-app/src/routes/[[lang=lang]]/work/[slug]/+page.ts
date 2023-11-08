import { DEFAULT_APP_LANG } from '$lib/consts';
import { fetchRepoStats, handleLoadError } from '$lib/data';
import { getCrop, urlFor } from '$lib/helpers/image';
import Logger from '$lib/logger';
import { findOne } from '$lib/store';

import type { PageLoad } from './$types';
import type { ProjectImage } from '$types';

const urlToBase64Asset = async (url: string, fetch: typeof window.fetch) => {
  const response = await fetch(url);

  if (!response.ok) {
    Logger.error(`Failed to fetch image ${url}`);
    return undefined;
  }

  const arrayBuffer = await response.arrayBuffer(),
    b64 = new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    ),
    mimeType =
      response.headers.get('content-type') ||
      response.headers.get('Content-Type') ||
      'image/jpeg';

  return `data:${mimeType};base64,${btoa(b64)}`;
};

export const load = (async ({ fetch, params, url }) => {
  const preview = url.searchParams.get('preview') === 'true' || false,
    project = handleLoadError(
      await findOne(fetch, 'project', {
        id: params.slug,
        lang: params.lang || DEFAULT_APP_LANG,
        preview
      })
    );

  const imagePromises: Promise<ProjectImage | undefined>[] = [];

  let images: ProjectImage[] = [];

  if (project.images?.length) {
    for (const imageAsset of project.images) {
      imagePromises.push(
        (async () => {
          const crop = getCrop(imageAsset),
            baseUrl = urlFor(imageAsset.asset._ref),
            placeholder = baseUrl
              .height(100)
              .rect(crop.left, crop.top, crop.width, crop.height)
              .fit('crop')
              .auto('format')
              .blur(40)
              .url(),
            url = urlFor(imageAsset.asset._ref)
              .height(800)
              .rect(crop.left, crop.top, crop.width, crop.height)
              .fit('crop')
              .auto('format')
              .url();

          return {
            crop,
            placeholder: await urlToBase64Asset(placeholder, fetch),
            asset: urlToBase64Asset(url, fetch)
          } satisfies ProjectImage;
        })()
      );
    }

    images = (await Promise.all(imagePromises)).filter(
      (entry) => entry !== undefined
    ) as ProjectImage[];
  }

  const { stars, watchers } = await fetchRepoStats(fetch, project.github);

  project.githubStars = stars;
  project.githubWatchers = watchers;

  return { project, images, routeFetch: fetch };
}) satisfies PageLoad;

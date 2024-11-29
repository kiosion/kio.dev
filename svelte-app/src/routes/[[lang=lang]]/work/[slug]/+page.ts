import { DEFAULT_APP_LANG } from '$lib/consts';
import { fetchRepoStats, handleLoadError } from '$lib/data';
import Logger from '$lib/logger';
import { buildImageUrl, getCrop } from '$lib/sanity';
import { findOne, incViews } from '$lib/store';

import type { PageLoad } from './$types';
import type { ProjectImage } from '$types';

const urlToBase64Asset = async (url: string, fetch: typeof window.fetch) => {
  const response = await fetch(url);

  if (!response.ok) {
    Logger.error(`Failed to fetch image ${url}`);
    return '';
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

export const load = (async ({ parent, fetch, params, url }) => {
  const _parent = await parent(),
    preview = url.searchParams.get('preview') === 'true' || false,
    opts = { id: params.slug, lang: params.lang || DEFAULT_APP_LANG } as Record<
      string,
      string | boolean
    >,
    project =
      (!preview &&
        opts.lang === DEFAULT_APP_LANG &&
        _parent?.projects?.find?.((proj) => proj.slug?.current === params.slug)) ||
      handleLoadError(await findOne(fetch, 'project', opts));

  preview && (opts.preview = true);

  const imagePromises: Promise<ProjectImage | undefined>[] = [];

  let images: ProjectImage[] = [];

  if (project.images?.length) {
    for (const imageAsset of project.images) {
      imagePromises.push(
        (async () => {
          const crop = getCrop(imageAsset),
            placeholder = buildImageUrl({
              ref: imageAsset.asset._ref,
              crop,
              height: 80,
              blur: 40
            }),
            url = buildImageUrl({
              ref: imageAsset.asset._ref,
              crop,
              height: 800
            });

          return {
            crop,
            placeholder: await urlToBase64Asset(placeholder, fetch),
            asset: urlToBase64Asset(url, fetch),
            sanityAsset: imageAsset
          } satisfies ProjectImage;
        })()
      );
    }

    // @ts-expect-error idek this type just seems fucked
    images = (await Promise.all<ProjectImage[]>(imagePromises)).filter(
      (entry) => entry !== undefined
    );
  }

  const { stars, watchers } = await fetchRepoStats(fetch, project.github);

  project.githubStars = stars;
  project.githubWatchers = watchers;

  project && incViews(fetch, project).catch(Logger.error);

  return { project, images, routeFetch: fetch };
}) satisfies PageLoad;

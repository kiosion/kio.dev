import { unwrapAPIResponse } from '$lib/api/result';
import { findOne, incViews } from '$lib/api/store';
import { DEFAULT_APP_LANG } from '$lib/consts';
import { fetchRepoStats } from '$lib/data';
import Logger from '$lib/logger';
import { buildImageUrl, getCrop } from '$lib/sanity';

import type { PageLoad } from './$types';
import type { SingleParams } from '$lib/api/store';
import type { ProjectImage } from '$types/documents';

// TODO: bad bad no good solution to broken/weird type narrowing
type RecurseNonNullable<T> = T extends null | undefined
  ? never
  : T extends object
    ? {
        [P in keyof T]-?: RecurseNonNullable<T[P]>;
      }
    : T;

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
    opts: SingleParams<'project'> = {
      id: params.slug,
      lang: params.lang || DEFAULT_APP_LANG
    };
  preview && (opts.preview = true);

  const project =
    (!preview &&
      opts.lang === DEFAULT_APP_LANG &&
      _parent?.projects?.find?.((proj) => proj.slug?.current === params.slug)) ||
    unwrapAPIResponse(await findOne(fetch, 'project', opts));

  const imagePromises: Promise<ProjectImage | undefined>[] = [];

  let images: ProjectImage[] = [];

  if (project.images?.length) {
    for (const imageAsset of project.images) {
      if (!imageAsset?.asset?._ref) {
        continue;
      }
      const sanityAsset = imageAsset as RecurseNonNullable<typeof imageAsset>;
      imagePromises.push(
        (async () => {
          const crop = getCrop(sanityAsset),
            placeholder = buildImageUrl({
              ref: sanityAsset.asset._ref,
              crop,
              height: 80,
              blur: 40
            }),
            url = buildImageUrl({
              ref: sanityAsset.asset._ref,
              crop,
              height: 800
            });

          return {
            crop,
            placeholder: await urlToBase64Asset(placeholder, fetch),
            asset: urlToBase64Asset(url, fetch),
            sanityAsset
          } satisfies ProjectImage;
        })()
      );
    }

    images = (await Promise.all(imagePromises)).filter(
      (entry) => entry !== undefined
    ) as ProjectImage[];
  }

  if (project?.github) {
    const { stars, watchers } = await fetchRepoStats(fetch, project.github);

    // @ts-expect-error: Include these separately since they don't exist on API resp
    project.githubStars = stars;
    // @ts-expect-error: Include these separately since they don't exist on API resp
    project.githubWatchers = watchers;
  }

  project && incViews(fetch, project);

  return { project, images, routeFetch: fetch };
}) satisfies PageLoad;

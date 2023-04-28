import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import Store from '$lib/store';
import { error } from '@sveltejs/kit';
import type { ResData, PostDocument, ExternalUserInfo } from '$types';
import type { PageLoad } from './$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const post: ResData<PostDocument> | undefined =
    await Store.findOne<PostDocument>(fetch, 'post', {
      idb: btoa(params.slug),
      lang: params.lang ?? 'en'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  if (!post) {
    throw error(404, {
      message: "Sorry, that post couldn't be found or doesn't exist"
    });
  }

  const headings =
    (await (
      await fetch('/api/transform/parsept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'parseHeadings',
          data: post?.data.body ?? []
        })
      })
    )?.json()) ?? [];

  let userInfo: ExternalUserInfo | null = null;

  const authValid = await fetch('/api/v1/auth/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => !!res.ok)
    .catch((_err) => false);

  if (authValid) {
    userInfo = await fetch('/api/v1/auth/fetch_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json().then((json) => json.data))
      .catch((_err) => ({}));
  }

  return { post, headings, authState: authValid, userInfo, routeFetch: fetch };
};

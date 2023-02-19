import { REMOTE_API_URL } from '$lib/env';
import { fetchRemote } from '$lib/data.server';
import Logger from '$lib/logger';
import type { RequestHandler } from '@sveltejs/kit';
import type { PostDocument, ResDataMany } from '$types';

type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

export const GET = (async ({ url }) => {
  const genericError = new Response(
    JSON.stringify({
      status: 500,
      error: 'Endpoint error: Something went wrong'
    }),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    }
  );

  try {
    const endpoint = `${REMOTE_API_URL}/query/posts?limit=0&s=date&order=desc`,
      remoteRes = await fetchRemote({ endpoint });

    if (remoteRes instanceof Error) {
      Logger.error('[RSS] Error from fetchRemote: ', {}, remoteRes);
      throw Error;
    }

    return new Response(renderXML(remoteRes), {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'Cache-Control': 'max-age=0, s-max-age=3600'
      }
    });
  } catch {
    return genericError;
  }
}) satisfies RequestHandler;

const XML_HEADERS = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="https://kio.dev/rss" rel="self" type="application/rss+xml" />
    <title>Kio.dev</title>
    <link>https://kio.dev</link>
    <description>My thoughts on tech, design, and development things</description>
    <language>en-ca</language>
`.trim(),
  XML_FOOTERS = `
  </channel>
</rss>
  `.trim();

const renderXML = (data: UnpackPromise<ReturnType<typeof fetchRemote>>) => {
  const posts = (data as unknown as ResDataMany<PostDocument>).data,
    items = posts
      .map((post) => {
        const { slug, title, date, desc } = post;

        return `
        <item>
          <guid>https://kio.dev/blog/${slug.current}</guid>
          <title>${title}</title>
          <link>https://kio.dev/blog/${slug.current}</link>
          <description>${desc}</description>
          <pubDate>${new Date(date).toUTCString()}</pubDate>
        </item>
      `.trim();
      })
      .join('');

  return `
${XML_HEADERS}
${items}
${XML_FOOTERS}
  `.trim();
};

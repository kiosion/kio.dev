import { APP_LANGS, LOCAL_SETTINGS_KEY } from '$lib/consts';

import type { Handle, HandleServerError, ResolveOptions } from '@sveltejs/kit';

const replaceTheme = (html: string, theme: string) => {
  const classAttrRegexp = /<body([^>]*?)class="([^"]*?)"/i,
    htmlTagRegexp = /<body([^>]*?)>/i;

  if (classAttrRegexp.test(html)) {
    return html.replace(classAttrRegexp, `<body$1class="$2 ${theme}"`);
  } else if (htmlTagRegexp.test(html)) {
    return html.replace(htmlTagRegexp, `<body$1 class="${theme}">`);
  }

  return html;
};

export const handle = (async ({ event, resolve }) => {
  const resolveOptions: ResolveOptions = {},
    transforms = [] as Array<(html: string) => string>;

  resolveOptions.filterSerializedResponseHeaders = (name: string, _value: string) => {
    switch (name) {
      case 'content-type':
        return true;
      default:
        return false;
    }
  };

  const lang = event.request.url.match(
      new RegExp(`^.*(?:(?:.[a-z]{3})|(?:[a-z]+:[0-9]{4}))/(${APP_LANGS.join('|')})/?`)
    ),
    settings = event.cookies.get(LOCAL_SETTINGS_KEY);

  if (lang) {
    transforms.push((html) =>
      html.replace(/<html lang="en">/, `<html lang="${lang[1]}">`)
    );
  }

  let theme = '';

  if (settings) {
    try {
      const parsed_settings = JSON.parse(
        Buffer.from(settings, 'base64')?.toString?.() || '{}'
      );

      if (Array.isArray(parsed_settings)) {
        parsed_settings.forEach(([key, savedSetting]) => {
          if (key === 'theme') {
            theme = savedSetting;
          }
        });
      }
    } catch (e) {
      console.error('Failed while parsing settings cookie from request', e);
    }
  }

  // Fall back to dark theme
  if (!theme || !['light', 'dark'].includes(theme)) {
    theme = 'dark';
  }

  transforms.push((html) => replaceTheme(html, theme));

  if (transforms.length) {
    resolveOptions.transformPageChunk = ({ html }) =>
      transforms.reduce((html, transform) => transform(html), html);
  }

  return await resolve(event, resolveOptions);
}) satisfies Handle;

export const handleError = (({ error, event }) => {
  try {
    return {
      code: (error as Error & { code?: number })?.code ?? 500,
      message: (error as Error)?.message ?? 'An unknown error occurred'
    };
  } catch {
    return {
      status: 500,
      message: 'Internal server error'
    };
  }
}) satisfies HandleServerError;

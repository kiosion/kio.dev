import type { Handle, HandleServerError, ResolveOptions } from '@sveltejs/kit';
import { APP_LANGS, APP_THEMES, LOCAL_SETTINGS_KEY } from '$lib/consts';

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
      new RegExp(`^(?:https?://)?[^/]+/(${APP_LANGS.join('|')})/?`)
    ),
    settings = event.cookies.get(LOCAL_SETTINGS_KEY);

  if (lang?.[1] && APP_LANGS.includes(lang[1])) {
    transforms.push((html) =>
      html.replace(/<html lang="en">/, `<html lang="${lang[1]}">`)
    );
  }

  let theme: (typeof APP_THEMES)[keyof typeof APP_THEMES] = APP_THEMES.DARK;

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
  if (!theme || !Object.values(APP_THEMES).includes(theme)) {
    theme = APP_THEMES.DARK;
  }

  transforms.push((html) => replaceTheme(html, theme));

  if (transforms.length) {
    resolveOptions.transformPageChunk = ({ html }) =>
      transforms.reduce((html, transform) => transform(html), html);
  }

  return await resolve(event, resolveOptions);
}) satisfies Handle;

export const handleError = (({ error }) => ({
  code: (error as Error & { code?: number })?.code ?? 500,
  message: (error as Error)?.message ?? 'An unknown error occured.',
  stack: (error as Error)?.stack
})) satisfies HandleServerError;

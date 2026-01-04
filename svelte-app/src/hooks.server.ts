import type { Handle, HandleServerError, ResolveOptions } from '@sveltejs/kit';
import { APP_LANGS, APP_THEMES } from '$lib/consts';
import { isThemeChoice, THEME_COOKIE_NAME } from '$lib/theme';

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
    theme = event.cookies.get(THEME_COOKIE_NAME);

  if (lang?.[1] && APP_LANGS.includes(lang[1])) {
    transforms.push((html) =>
      html.replace(/<html lang="en">/, `<html lang="${lang[1]}">`)
    );
  }

  const parsedTheme = isThemeChoice(theme) ? theme : APP_THEMES.DARK;

  transforms.push((html) => replaceTheme(html, parsedTheme));

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

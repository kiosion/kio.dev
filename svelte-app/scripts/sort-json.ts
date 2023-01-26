/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/**
 * Run with Deno: deno run --allow-read --allow-write lint-json.ts
 */

import { parse } from 'https://deno.land/std@0.174.0/flags/mod.ts';

const { f, fix, _: filePaths } = parse(Deno.args);

if (!filePaths?.length) {
  throw new Error('[sort-json] No file path(s) provided');
} else if (filePaths.some((p: string) => !p.match(/\.json$/gi))) {
  throw new Error('[sort-json] File(s) must be JSON');
}

const shouldFix = f || fix,
  errors = [] as string[];

filePaths.forEach((filePath: string) => {
  if (!filePath.match(/languages\/[a-z]{2}\.json/gi)) {
    return;
  }

  const contents = JSON.parse(Deno.readTextFileSync(filePath)),
    sortedKeys = Object.keys(contents).sort();

  if (shouldFix) {
    const sortedContents = sortedKeys.reduce((acc, key) => {
      acc[key] = contents[key];
      return acc;
    }, {} as Record<string, string>);

    Deno.writeTextFileSync(filePath, JSON.stringify(sortedContents, null, 2));
    console.log(`[sort-json] Sorted '${filePath}'`);
  } else {
    const keys = Object.keys(contents);
    for (let i = 0; i < sortedKeys.length; i++) {
      sortedKeys[i] !== keys[i] &&
        errors.push(`- '${filePath}': Key is unsorted: '${keys[i]}'`);
    }

    if (errors.length) {
      console.error(`\n[sort-json] Format errors:\n\n${errors.join('\n')}`);
    } else {
      console.log('[sort-json] All files are formatted');
    }
  }
});

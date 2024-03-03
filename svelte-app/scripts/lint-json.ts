import { readFileSync, writeFileSync } from 'fs';

const args = Bun.argv.slice(2);
const filePaths: string[] = args;

if (!filePaths.length) {
  throw new Error('[sort-json] No file path(s) provided');
} else if (filePaths.some((p) => !p.match(/\.json$/i))) {
  throw new Error('[sort-json] File(s) must be JSON');
}

const sortObjectKeys = (obj: Record<string, unknown>) => {
  const sortedKeys = Object.keys(obj).sort();

  return sortedKeys.reduce((acc, key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      acc[key] = sortObjectKeys(obj[key] as Record<string, unknown>);
    }
    acc[key] = obj[key];
    return acc;
  }, {});
};

filePaths.forEach((filePath) => {
  if (!filePath.match(/languages\/[a-z]{2}\.json/i)) {
    return;
  }

  const contents = JSON.parse(readFileSync(filePath, 'utf-8'));
  const sortedContents = sortObjectKeys(contents);

  writeFileSync(filePath, JSON.stringify(sortedContents, null, 2), 'utf-8');
  console.log(`[sort-json] Sorted '${filePath}'`);
});

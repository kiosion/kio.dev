// Short Deno script to check for unused translation strings.

const translationDir = './src/languages';
const sourceDir = './src';

const getFiles = async (dir: string, exts = ['ts', 'svelte']) => {
  const files: string[] = [];
  for await (const dirEntry of Deno.readDir(dir)) {
    const entryPath = `${dir}/${dirEntry.name}`;
    if (dirEntry.isDirectory) {
      files.push(...(await getFiles(entryPath)));
    }
    if (
      dirEntry.isFile &&
      entryPath.match(new RegExp(`\\.(${exts.join('|')})$`))
    ) {
      files.push(entryPath);
    }
  }
  return files;
};

const getTranslationKeys = async (dir: string) => {
  const translationKeys: Set<string> = new Set();
  const translationFiles = await getFiles(dir, ['json']);
  translationFiles.forEach((file) => {
    const contents = JSON.parse(Deno.readTextFileSync(file));
    Object.keys(contents).forEach((key) => translationKeys.add(key));
  });
  return translationKeys;
};

const sourceFiles = await getFiles(sourceDir);
const translationKeys = await getTranslationKeys(translationDir);

const unusedTranslationKeys: string[] = [];

translationKeys.forEach((key) => {
  const isUsed = sourceFiles.some((file) => {
    const fileContents = Deno.readTextFileSync(file);
    return fileContents.includes(key);
  });
  if (!isUsed) {
    unusedTranslationKeys.push(key);
  }
});

if (unusedTranslationKeys.length) {
  console.error('Unused translation keys:', unusedTranslationKeys);
  Deno.exit(1);
}

import fs from 'fs';
import path from 'path';

const sourceDir = path.join(__dirname, '../src');
const translationDir = path.join(sourceDir, 'languages');
const typesDir = path.join(__dirname, '../types/generated');

const readLocaleFile = (locale: string) => {
  const filePath = path.join(translationDir, `${locale}.json`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const extractKeys = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return extractKeys(value, newKey);
    }
    return newKey;
  });

const generateTypes = (keys: string[]) => {
  const unionType = keys
    .map((key) => (key.includes("'") ? `"${key}"` : `'${key}'`))
    .join(' | ');

  return `export type LocaleKey = ${unionType};`;
};

const compareLocales = (locale1: object, locale2: object) => {
  const keys1 = extractKeys(locale1);
  const keys2 = extractKeys(locale2);
  return keys1.filter((key) => keys2.includes(key));
};

const enLocale = readLocaleFile('en');
const frLocale = readLocaleFile('fr');

const commonKeys = compareLocales(enLocale, frLocale);
const typesContent = generateTypes(commonKeys);

fs.writeFileSync(path.join(typesDir, 'index.ts'), typesContent);

console.log('Generated types for locales: ./types/generated/index.ts');

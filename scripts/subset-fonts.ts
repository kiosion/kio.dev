import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SOURCE_DIR = join(ROOT, 'fonts-source/tasa_orbiter');
const OUTPUT_DIR = join(ROOT, 'static/assets/fonts/tasa_orbiter');

// Unicode ranges to keep
const RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0020, 0x007e], // Basic Latin (printable ASCII)
  [0x00a0, 0x00ff], // Latin-1 Supplement (accented Latin, ©, ¡, ¿, …)
  [0x0100, 0x017f], // Latin Extended-A (additional European accents)
  [0x2010, 0x2027], // General Punctuation (em/en dash, smart quotes, ellipsis)
];

const FILES: readonly string[] = [
  'TASAOrbiterDisplay-Regular.woff2',
  'TASAOrbiterDisplay-SemiBold.woff2',
  'TASAOrbiterDisplay-Bold.woff2',
  'TASAOrbiterDeck-Regular.woff2',
  'TASAOrbiterDeck-SemiBold.woff2',
  'TASAOrbiterDeck-Bold.woff2',
];

const text = RANGES.flatMap(([start, end]) => {
  const out: string[] = [];
  for (let cp = start; cp <= end; cp++) {
    out.push(String.fromCodePoint(cp));
  }
  return out;
}).join('');

const fmt = (n: number) => `${(n / 1024).toFixed(1)}K`;

await mkdir(OUTPUT_DIR, { recursive: true });

let totalIn = 0;
let totalOut = 0;

for (const filename of FILES) {
  const original = await readFile(join(SOURCE_DIR, filename));
  const subset = await subsetFont(original, text, { targetFormat: 'woff2' });
  await writeFile(join(OUTPUT_DIR, filename), subset);

  totalIn += original.length;
  totalOut += subset.length;

  const pct = Math.round((1 - subset.length / original.length) * 100);
  console.log(
    `  ${filename}: ${fmt(original.length)} → ${fmt(subset.length)}  (-${pct}%)`,
  );
}

console.log(
  `\ntotal: ${fmt(totalIn)} → ${fmt(totalOut)}  (-${Math.round((1 - totalOut / totalIn) * 100)}%)`,
);

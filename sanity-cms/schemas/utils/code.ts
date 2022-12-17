// For some reason the syntax highlighting is borked rn
// import 'ace-builds/src-noconflict/mode-elixir';
// import 'ace-builds/src-noconflict/mode-haskell';
// import 'ace-builds/src-noconflict/mode-rust';

const extraLangs = [
  'Arduino',
  'ASP',
  'BASIC',
  'Brainfuck',
  'C',
  'C#',
  'C++',
  'CSS',
  'Clojure',
  'CoffeeScript',
  'Diff',
  'Dockerfile',
  'EJS',
  'Elixir',
  'EMACS Lisp',
  'EmberScript',
  'Fish',
  'FORTRAN',
  'Gleam',
  'Go',
  'Handlebars',
  'Haskell',
  'HTML',
  'Java',
  'JavaScript',
  'JSON',
  'JSX',
  'Jupyter Notebook',
  'Kotlin',
  'Lua',
  'Makefile',
  'Markdown',
  'Matlab',
  'Metal',
  'NGINX',
  'Pascal',
  'Perl',
  'Prisma',
  'PostCSS',
  'PHP',
  'PLSQL',
  'Python',
  'RRLang',
  'Ruby',
  'Rust',
  'SASS',
  'Scala',
  'SCSS',
  'Shell',
  'Svelte',
  'SVG',
  'Swift',
  'TSX',
  'TypeScript',
  'VIM',
  'Vue',
  'WebAssembly',
  'XML'
];

export const CodeBlockExtensionOpts = {
  languageAlternatives: [
    ...extraLangs.map((lang) => ({ title: lang, value: lang.toLowerCase() }))
  ]
};

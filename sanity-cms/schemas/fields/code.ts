export const languageAlternatives = [
  { title: 'ASP', value: 'asp' },
  { title: 'BASIC', value: 'basic' },
  { title: 'C', value: 'c' },
  { title: 'C#', value: 'csharp' },
  { title: 'C++', value: 'cpp' },
  { title: 'CSS', value: 'css' },
  { title: 'Clojure', value: 'clojure' },
  { title: 'Diff', value: 'diff' },
  { title: 'Dockerfile', value: 'dockerfile' },
  { title: 'EJS', value: 'ejs' },
  { title: 'Elixir', value: 'elixir' },
  { title: 'Elm', value: 'elm' },
  { title: 'Erlang', value: 'erlang' },
  { title: 'Fish', value: 'fish' },
  { title: 'FORTRAN', value: 'fortran' },
  { title: 'Gleam', value: 'gleam' },
  { title: 'Go', value: 'go' },
  { title: 'Handlebars', value: 'handlebars' },
  { title: 'Haskell', value: 'haskell' },
  { title: 'HTML', value: 'html', mode: 'html' },
  { title: 'Java', value: 'java', mode: 'java' },
  { title: 'JavaScript', value: 'javascript', mode: 'javascript' },
  { title: 'JSON', value: 'json', mode: 'json' },
  { title: 'JSX', value: 'jsx', mode: 'javascript' },
  { title: 'Jupyter Notebook', value: 'jupyter' },
  { title: 'Kotlin', value: 'kotlin' },
  { title: 'Lua', value: 'lua' },
  { title: 'Makefile', value: 'makefile' },
  { title: 'Markdown', value: 'markdown' },
  { title: 'NGINX', value: 'nginx' },
  { title: 'Pascal', value: 'pascal' },
  { title: 'Perl', value: 'perl' },
  { title: 'PHP', value: 'php' },
  { title: 'PLSQL', value: 'plsql' },
  { title: 'Python', value: 'python' },
  { title: 'Ruby', value: 'ruby' },
  { title: 'Rust', value: 'rust' },
  { title: 'SASS', value: 'sass' },
  { title: 'Scala', value: 'scala' },
  { title: 'SCSS', value: 'scss' },
  { title: 'Shell', value: 'shell', mode: 'bash' },
  { title: 'Svelte', value: 'svelte', mode: 'html' },
  { title: 'SVG', value: 'svg' },
  { title: 'Swift', value: 'swift' },
  { title: 'TSX', value: 'tsx', mode: 'typescript' },
  { title: 'TypeScript', value: 'typescript', mode: 'typescript' },
  { title: 'VIM', value: 'vim' },
  { title: 'Vue', value: 'vue' },
  { title: 'WebAssembly', value: 'wasm' },
  { title: 'XML', value: 'xml' }
];

export default ({
  defaultLang,
  languageAlts
}: { defaultLang?: string; languageAlts?: string[] } = {}) => {
  let filteredLanguages = languageAlternatives;
  if (languageAlts) {
    filteredLanguages = languageAlternatives.filter((lang) =>
      languageAlts.includes(lang.value)
    );
  }

  return {
    type: 'code',
    name: 'code',
    title: 'Code',
    options: {
      language: defaultLang || 'markdown',
      languageAlternatives: filteredLanguages,
      withFilename: true
    }
  };
};

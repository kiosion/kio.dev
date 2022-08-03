## About

Sveltekit client/server, sanity studio, and expressjs api for my art / development portfolio, blog, and social links.

(Soon to be) live at <a href="https://kio.dev/">https://kio.dev</a>

Info about the project at <a href="https://kio.dev/project/kio.dev">https://kio.dev/project/kio.dev</a>

## Building / running

Install deps
```bash
make install
```

Run locally
```bash
make run-dev
```

Build
```bash
make build-prod
```

## Testing

Run all tests
```bash
make build-test
node ./svelte-app/dist/
make vitest && make cypress
```

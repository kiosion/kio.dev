## About

Sveltekit client/server, sanity studio, and expressjs api for my art / development portfolio, blog, and social links.

(Eventually) live at <a href="https://kio.dev/">https://kio.dev</a>

## Building / running

Build
```bash
make prod
# or,
make dev
```

## Testing

Run all tests
```bash
make build-test
node ./svelte-app/dist/
# then,
make vitest && make cypress
```

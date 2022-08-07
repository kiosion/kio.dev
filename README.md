## About

Sveltekit client/server, sanity studio, and expressjs api for my art / development portfolio, blog, and social links.

(Eventually) live at <a href="https://kio.dev/">https://kio.dev</a>

## Building / running

Build
```bash
make install && make build-prod
```

## Testing

Run all tests
```bash
make build-test
node ./svelte-app/dist/
make vitest && make cypress
```

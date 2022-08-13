![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/ci.yml/badge.svg) ![Netlify Status](https://api.netlify.com/api/v1/badges/b300e0f9-e70d-4358-b27d-09a862efbc8d/deploy-status)

## About

The sveltekit app, sanity instance, and api for my art / development portfolio, blog, and social links.

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

![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/ci.yml/badge.svg) ![Netlify Status](https://api.netlify.com/api/v1/badges/b300e0f9-e70d-4358-b27d-09a862efbc8d/deploy-status)

## About

Frontend + backend monorepo for the site hosting my art / development portfolio, blog, and CV.

(Eventually) live at <a href="https://kio.dev/">https://kio.dev</a> / <a href="https://kio.sh/">https://kio.sh</a>

### Tech stack

- Sveltekit
- Typescript
- Scss
- Sanity.io
- Express.js
- Rust

## Building / running

Build for dev
```bash
make dev
```

Build for UI dev only (use existing backends)
```bash
make backed
```

Build for testing / production
```bash
make prod
```

## Testing

Run all tests
```bash
make build-test
node ./svelte-app/dist/
# simultaneously,
make vitest && make cypress
```

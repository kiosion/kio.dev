![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/ci.yml/badge.svg) ![Netlify Status](https://api.netlify.com/api/v1/badges/b300e0f9-e70d-4358-b27d-09a862efbc8d/deploy-status)

## About

Frontend + backend monorepo for the site hosting my art / development portfolio, blog, and CV.

(Eventually) live at <a href="https://kio.dev/">https://kio.dev</a> / <a href="https://kio.sh/">https://kio.sh</a>

<img src="https://user-images.githubusercontent.com/34040324/186787872-ddf956cf-9c26-4600-a32e-64a9232786e7.jpg" alt="Preview 1" width="48%" /> <img src="https://user-images.githubusercontent.com/34040324/186787906-80d237e5-3d49-4bc3-afdb-349f16e2fd48.jpg" alt="Preview 2" width="48%" />

### Tech stack

- Svelte
- Typescript
- Scss
- Vite
- Sanity
- Express.js
- Rust
- pm2
- Netlify

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

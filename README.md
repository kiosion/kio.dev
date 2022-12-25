<div align="center">
  <h1>📜 kio.dev</h1>

![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/svelte.yml/badge.svg) 
![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/api.yml/badge.svg) ![Netlify Status](https://api.netlify.com/api/v1/badges/b300e0f9-e70d-4358-b27d-09a862efbc8d/deploy-status)

  <p>Frontend + backend monorepo for the site hosting my art / development portfolio, blog, and CV</p>
</div>

## 💁 Info


<img width="49%" src="https://user-images.githubusercontent.com/34040324/208616128-687d3783-6ab8-46c4-83aa-227a3f61c7c5.png" /> <img width="49%" src="https://user-images.githubusercontent.com/34040324/208616135-929b4874-e38f-4fdc-93f5-a18f6e55f326.png" />

Live at <a href="https://kio.dev/">https://kio.dev</a> :)

Pretty overengineered, but done so intentionally, trust 😃

## 📚 Tech stack

#### Frontend
- Sveltekit
- Typescript
- Tailwind + SCSS
- Vite (+ Rollup)
- Babel
#### API
- Elixir
- Poison / Cowboy / HTTPoison
- Sanity.io
#### Hosting / deploys
- Selfhosted GHA runners
- Vultr VPS'
- Docker
- Netlify

## 💾 Dependancies
- Node >= 16.16
- NVM
- Yarn >= 3.0
- Elixir >= 1.13
- Rebar3
- Hex

## 🛠 Building / Testing

#### Build for dev
Builds & runs livereload servers for local API, sanity studio, and sveltekit
```bash
make dev
```

#### Build for UI dev
Runs sveltekit against existing dev APIs
```bash
make backed
```

#### Build UI for testing / production
Only difference between testing/prod is the stripping of test selectors
```bash
make test / prod
```

## 🧪 Testing

#### Run all tests
```bash
make test
make vitest
(node ./svelte-app/dist/) & make cypress
```

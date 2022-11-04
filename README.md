<div align="center">
  <h1>📜 kio.dev</h1>

![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/svelte.yml/badge.svg) 
![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/api.yml/badge.svg) ![Netlify Status](https://api.netlify.com/api/v1/badges/b300e0f9-e70d-4358-b27d-09a862efbc8d/deploy-status)

  <p>Frontend + backend monorepo for the site hosting my art / development portfolio, blog, and CV</p>
  
</div>

## 💁 Info

(Eventually) live at <a href="https://kio.dev/">https://kio.dev</a> / <a href="https://kio.sh/">https://kio.sh</a>

Mostly overengineered, but intentionally so 😃

## 📚 Tech stack

#### Frontend
- Sveltekit
- Typescript
- Scss
- Vite
#### API
- Elixir
- CowBoy HTTP server
- HTTPoison
- Sanity
#### Hosting / deploys
- Selfhosted GH runners
- Vultr
- Docker
- Netlify

## 💾 Dependancies
### SvelteKit / Sanity
- Node >= 16.16
- Yarn >= 3.0
### Elixir API
- Elixir >= 1.13
- Rebar3 / Rebar
- Hex

## 🛠 Building

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

#### Build for testing / production
Only difference is env variables & stripping of test selectors / classes
```bash
make prod
```

## 🧪 Testing

#### Run all tests
```bash
make test
make vitest
make api-test
(cd ./svelte-app/; node ./dist/) & make cypress
```

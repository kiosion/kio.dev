<div align="center">
  <h1>📜 kio.dev</h1>

![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/ci.yml/badge.svg) ![Netlify Status](https://api.netlify.com/api/v1/badges/b300e0f9-e70d-4358-b27d-09a862efbc8d/deploy-status)

  <p>Frontend + backend monorepo for the site hosting my art / development portfolio, blog, and CV</p>
  
</div>

## 💁 Info

(Eventually) live at <a href="https://kio.dev/">https://kio.dev</a> / <a href="https://kio.sh/">https://kio.sh</a>

Mostly way overengineered, but done so for fun (and to showcase relevant skills) 😃

## 📚 Tech stack

#### Frontend
- Svelte
- Typescript
- Scss
- Vite
#### API
- Express.js
- Rust
#### CMS
- Sanity w/ Sanity studio
#### Hosting / deploys
- Selfhosted GH runners
- Vultr VPS w/ pm2
- Netlify

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
(cd ./svelte-app/; node ./dist/) & make cypress
```

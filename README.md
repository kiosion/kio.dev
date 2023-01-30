<div align="center">
  <h1>kio.dev</h1>
</div>

Welcome to the monorepo for kio.dev, my personal website featuring my blog, development portfolio, nowpage, and CV.

You can see the project live at https://kio.dev.

## 🔎 Preview

<img width="49%" src="https://user-images.githubusercontent.com/34040324/213913077-8a006ab8-70b5-405d-9ac0-69bf1188a006.png" /> <img width="49%" src="https://user-images.githubusercontent.com/34040324/213913110-6f3ee3c7-b6ac-404b-97ad-fc859404c66e.png" />

## 📚 Tech stack
The frontend is built with:
* Sveltekit
* Typescript
* Tailwindcss + some SCSS utils/scoped styles
* Vite (with Rollup)
* Babel

The API powering the site is built with:
* Elixir
* Poison, Cowboy, and HTTPoison
* Sanity.io

For hosting and deploys, I use:
* Self-hosted GitHub Actions runners
* Vultr VPSs
* Docker
* Netlify

## 📦 Dependencies
To build and test this project, you'll need the following:

* Node >= 16.16
* Yarn >= 3.0
* Elixir >= 1.13
* Rebar3
* Hex
* Docker
* docker-compose

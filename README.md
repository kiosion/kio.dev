<div align="center">
  <h1>kio.dev</h1>

![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/svelte.yml/badge.svg) 
![Workflow Status](https://github.com/kiosion/kio.dev/actions/workflows/api.yml/badge.svg) ![Netlify Status](https://api.netlify.com/api/v1/badges/b300e0f9-e70d-4358-b27d-09a862efbc8d/deploy-status)
</div>

Welcome to the monorepo for kio.dev, my personal website and blog featuring my art, development portfolio, and CV. It's overengineered, but intentionally, I wanted to try and pull together new / exciting tech :)

You can visit the live site at https://kio.dev.

## Preview

<img width="49%" src="https://user-images.githubusercontent.com/34040324/208616128-687d3783-6ab8-46c4-83aa-227a3f61c7c5.png" /> <img width="49%" src="https://user-images.githubusercontent.com/34040324/208616135-929b4874-e38f-4fdc-93f5-a18f6e55f326.png" />

## Tech stack
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

## Dependencies
To build and test this project, you'll need the following dependencies installed:

* Node >= 16.16
* Yarn >= 3.0
* Elixir >= 1.13
* Rebar3
* Hex
* Docker
* docker-compose

## Building and Testing

To build the project for development, run:

```bash
make dev
```

This will build and run livereload servers for the local API, Sanity studio, and Sveltekit.

To build the UI for development against existing dev APIs, run:

```bash
make backed
```

To build the UI for testing or production, run `make test` or `make prod`. The only difference between these two builds is the stripping of test selectors and usage of [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect).

To run all tests, use the following commands:

```bash
make test
make vitest
(node ./svelte-app/dist/) & make cypress
```

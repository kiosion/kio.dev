## About

Sveltekit app, sanity studio, and express api for my art / development portfolio, blog, and social links.

(Soon to be) live at <a href="https://kio.dev/">kio.dev</a>

## Building / running

These steps are mostly here for me, or as a guide if you want to fork this project. As-is, it won't build or run properly as neccesary environment variables obviously aren't present in this repo :p

### Project setup

Clone, then install node packages:
```bash
./$ yarn install
./express-api/$ yarn install
./sanity-cms/$ yarn install
./svelte-app/$ yarn install
```

Install/init husky & lint-staged:
```bash
./$ yarn husky-init && yarn install
```

### Running sanity cms

Running locally requires the sanity cms & express api as backends, either locally or using <a href="https://api.kio.dev/">api.kio.dev</a>.

Run Sanity locally:
```bash
./sanity-cms/$ yarn sanity update && yarn sanity start
```

Or, deploy:
```bash
./sanity-cms/$ yarn sanity update && yarn sanity deploy
```

### Running express api

To run the express api locally:
```bash
./express-api/$ yarn build && yarn serve
```

### Running svelte app

#### Prod

```bash
./svelte-app/$ yarn build && yarn serve
```

#### Dev

```bash
./svelte-app/$ yarn dev
```

## Issues / To-do

Check out <a href="TODO.md">TODO.md</a>.

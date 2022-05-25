## About

React app, sanity studio, and nodejs / express api for my visual art / development portfolio, blog, bio, and social links.

Live at <a href="https://kio.dev/">kio.dev</a>

## Building / running

These steps are mostly here for me, or as a guide if you want to fork this project. As-is, it won't build or run properly as neccesary environment variables obviously aren't present in this repo :p

### Project setup

Clone:
```bash
git clone https://github.com/kiosion/portfolio ./kio-portfolio
```

Install node packages for react app and base project:
```bash
cd ./kio-portfolio/ && npm i && \
cd ./react-app/ && npm i && cd ../
```

Install/init husky & lint-staged:
```bash
npx husky-init && npm i
```

### Running sanity cms

Running locally requires the sanity cms & express api to be available as backends, either locally, or using <a href="https://api.kio.dev/">api.kio.dev</a>.

To run sanity locally:
```bash
cd ./sanity-cms/ && npm i && \
npx sanity update && npx sanity start
```

Or, to deploy:
```bash
cd ./sanity-cms/ && npm i && \
npx sanity update && npx sanity deploy
```

### Running express api

To run the express api locally:
```bash
cd ./express-api/ && npm i && \
npx run build && npx run serve
```

### Running react app

#### Prod

```bash
cd ./react-app/ && npm run build && npm run serve
```

#### Dev

```bash
cd ./react-app/ && npm run start
```

## Issues / To-do

Check out <a href="TODO.md">TODO.md</a>.

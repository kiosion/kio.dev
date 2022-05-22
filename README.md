## About

React app / sanity studio / nodejs api for my visual art / development portfolio, blog, bio, and social links.

Live at <a href="https://kio.dev/">kio.dev</a>

## Building

Clone / install deps

```bash
git clone https://github.com/kiosion/portfolio kio-portfolio && \
cd ./kio-portfolio/ && npm i && cd ./react-app/ && npm i && cd ../sanity-cms/ && npm i && ../express-api/ && npm i && cd ../ && \
npx husky-init && npm i
```

Running locally requires the sanity & express api to be available as backends, either locally, or using <a href="https://api.kio.dev/">api.kio.dev</a>.

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

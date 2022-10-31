# Hexerei

Elixir API for kio.dev.

## Building
### Dev
Build a live server for development:
```bash
make dev
```

### Production
Build a docker container for the production dataset:
```bash
# Build 'hexerei:prod' container
make prod
```

Build a docker container for the development dataset:
```bash
# Build 'hexerei:dev' container
make prod-dev
```

Building for production requires the following ENV variables:
- `SANITY_TOKEN` - Secret token for Sanity client
- `SANITY_PROJECT_ID` - Project ID for Sanity client
- `API_KEY` - Oauth secret for Bearer auth

Running the docker container requires allowing access to the needed port:
```bash
docker run -p 4444:4444 -it -d --name hexerei-dev hexerei:dev 
```

## Testing
Run all Mix unit tests
```bash
make test
```

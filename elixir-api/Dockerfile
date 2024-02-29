FROM elixir:1.16.1-otp-26-alpine AS build

RUN apk upgrade --no-cache && apk add --update bash openssl libgcc libstdc++ ncurses-libs

ARG ENV=prod
ENV ENV=$ENV
ARG SANITY_TOKEN
ARG SANITY_PROJECT_ID
ARG API_TOKEN
ARG GCLOUD_KEY

RUN mkdir /app
WORKDIR /app

ADD ./bin/release .

COPY mix.exs mix.lock ./
COPY config config
COPY lib lib

RUN echo "export SANITY_TOKEN=$SANITY_TOKEN" > .env &&\
    echo "export SANITY_PROJECT_ID=$SANITY_PROJECT_ID" >> .env &&\
    echo "export API_TOKEN=$API_TOKEN" >> .env &&\
    echo "export GCLOUD_KEY=$GCLOUD_KEY" >> .env &&\
    ./release \
        --project_id $SANITY_PROJECT_ID \
        --sanity_token $SANITY_TOKEN \
        --api_token $API_TOKEN \
        --gcloud_key $GCLOUD_KEY \
        --env $ENV

FROM elixir:1.16.1-otp-26-alpine AS app

RUN apk upgrade && apk add --update bash openssl libgcc libstdc++ ncurses-libs

ARG ENV

RUN mkdir /app
WORKDIR /app

COPY --from=build /app/_build .
COPY --from=build /app/.env .env

RUN echo "#!/bin/sh" > /app/entrypoint.sh &&\
    echo ". .env && /app/${ENV}/rel/hexerei/bin/hexerei start" >> /app/entrypoint.sh &&\
    chmod +x /app/entrypoint.sh &&\
    chown -R nobody: /app

USER nobody

ENTRYPOINT ["/app/entrypoint.sh"]

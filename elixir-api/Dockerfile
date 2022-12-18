FROM elixir:1.14-alpine AS build

RUN apk upgrade --no-cache
RUN apk add --update bash openssl libgcc libstdc++ ncurses-libs

ARG ENV=prod
ARG PORT=4000

ARG SANITY_TOKEN
ARG SANITY_PROJECT_ID
ARG SANITY_DATASET
ARG API_TOKEN

RUN mkdir /app
WORKDIR /app

ADD ./bin/release .

COPY mix.exs mix.lock ./
COPY config config
COPY lib lib

RUN ./release \
        --project_id $SANITY_PROJECT_ID \
        --dataset $SANITY_DATASET \
        --token $SANITY_TOKEN \
        --api_token $API_TOKEN \
        --port $PORT \
        --env $ENV

FROM alpine:3.16.2 AS app

RUN apk upgrade --no-cache
RUN apk add --update bash openssl libgcc libstdc++ ncurses-libs

ARG ENV
ARG SANITY_TOKEN
ARG SANITY_PROJECT_ID
ARG API_TOKEN
ARG PORT

EXPOSE $PORT

RUN mkdir /app
WORKDIR /app

COPY --from=build /app/_build ./

RUN echo "SANITY_TOKEN=$SANITY_TOKEN" > ./.env &&\
    echo "SANITY_PROJECT_ID"=$SANITY_PROJECT_ID >> ./.env &&\
    echo "API_TOKEN"=$API_TOKEN >> ./.env

RUN chown -R nobody: /app
USER nobody

ARG START_PATH=/app/$ENV/rel/hexerei/bin/hexerei

RUN echo "#!/bin/bash" > ./entrypoint.sh &&\
    echo "exec ${START_PATH} start" >> ./entrypoint.sh

RUN chown nobody: ./entrypoint.sh &&\
    chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

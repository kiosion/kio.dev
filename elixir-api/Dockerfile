FROM elixir:1.14-slim AS build

ARG ENV=prod
ENV ENV=$ENV
ARG SANITY_TOKEN
ARG SANITY_PROJECT_ID
ARG API_TOKEN

RUN mkdir /app
WORKDIR /app

ADD ./bin/release .

COPY mix.exs mix.lock ./
COPY config config
COPY lib lib

RUN echo "export SANITY_TOKEN=$SANITY_TOKEN" > .env &&\
    echo "export SANITY_PROJECT_ID=$SANITY_PROJECT_ID" >> .env &&\
    echo "export API_TOKEN=$API_TOKEN" >> .env

RUN ./release \
        --project_id $SANITY_PROJECT_ID \
        --sanity_token $SANITY_TOKEN \
        --api_token $API_TOKEN \
        --env $ENV

FROM elixir:1.14-slim AS app

ARG ENV

RUN mkdir /app
WORKDIR /app

COPY --from=build /app/_build .
COPY --from=build /app/.env .env

RUN echo "#!/bin/bash" > ./entrypoint.sh &&\
    echo ". .env && /app/${ENV}/rel/hexerei/bin/hexerei start" >> ./entrypoint.sh &&\
    chmod +x ./entrypoint.sh &&\
    chown -R nobody: /app

USER nobody

ENTRYPOINT ["./entrypoint.sh"]

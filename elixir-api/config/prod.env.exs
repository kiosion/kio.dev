import Mix.Config

config :hexerei,
  port: {"PORT", :system},
  # TODO: Oauth bearer instead of hardcoded token
  api_token: {"API_TOKEN", "{{API_TOKEN}}"},
  sanity_project_id: {"SANITY_PROJECT_ID", "{{SANITY_PROJECT_ID}}"},
  sanity_dataset: {"SANITY_DATASET", "production"},
  sanity_token: {"SANITY_TOKEN", "{{SANITY_TOKEN}}"},
  sanity_api_version: {"SANITY_API_VERSION", "2021-06-07"},
  query_url: {"QUERY_URL", "query/"},
  sanity_apicdn: {"SANITY_APICDN", "true", :boolean},
  gcloud_key: {"GCLOUD_KEY", "{{GCLOUD_KEY}}"},
  redis_uri: {"REDIS_URI", :system},
  app_env: {"APP_ENV", "prod"}

config :os_mon,
  disk_space_check_interval: 60,
  memory_check_interval: 2,
  disk_almost_full_threshold: 0.90,
  start_cpu_sup: false

config :sasl,
  errlog_type: :error

import Mix.Config

config :hexerei,
  port: {"PORT", :system},
  api_token: {"DEV_API_TOKEN", "1234567890"},
  sanity_project_id: {"SANITY_PROJECT_ID", :system},
  sanity_dataset: {"SANITY_DATASET", "dev"},
  sanity_token: {"SANITY_TOKEN", :system},
  sanity_api_version: {"SANITY_API_VERSION", "2021-06-07"},
  query_url: {"QUERY_URL", "query/"},
  sanity_apicdn: {"SANITY_APICDN", "false", :boolean},
  gcloud_key: {"GCLOUD_KEY", :system},
  app_env: {"APP_ENV", "test"}

config :os_mon,
  disk_space_check_interval: 5,
  memory_check_interval: 1,
  disk_almost_full_threshold: 0.90,
  start_cpu_sup: false

config :sasl,
  errlog_type: :info

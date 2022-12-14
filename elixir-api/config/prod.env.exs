import Mix.Config

config :hexerei,
  port: ${PORT},
  # TODO: Oauth bearer instead of hardcoded token
  api_token: ${API_TOKEN},
  sanity_project_id: ${SANITY_PROJECT_ID},
  sanity_dataset: ${SANITY_DATASET},
  sanity_token: ${SANITY_TOKEN},
  sanity_api_version: "2021-06-07",
  query_url: "query/",
  sanity_apicdn: true

config :os_mon,
  disk_space_check_interval: 60,
  memory_check_interval: 2,
  disk_almost_full_threshold: 0.90,
  start_cpu_sup: false

# TODO: Log info/warns to file, only errors to console
config :sasl,
  errlog_type: :error

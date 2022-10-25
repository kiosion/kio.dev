import Mix.Config

config :hexerei,
  port: 4444,
  api_token: "1234567890",
  sanity_project_id: System.get_env("SANITY_PROJECT_ID") || "",
  sanity_dataset: "dev",
  sanity_token: System.get_env("SANITY_TOKEN") || "",
  sanity_api_version: "2021-06-07",
  query_url: "query/"

config :os_mon,
  disk_space_check_interval: 5,
  memory_check_interval: 1,
  disk_almost_full_threshold: 0.90,
  start_cpu_sup: false

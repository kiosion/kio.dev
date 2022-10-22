import Mix.Config

config :hexerei,
  port: System.get_env("PORT") || 4000,
  api_version: System.get_env("API_VERSION") || "v1",
  api_token: System.get_env("API_TOKEN"),
  sanity_project_id: System.get_env("SANITY_PROJECT_ID") || "",
  sanity_dataset: System.get_env("SANITY_DATASET") || "production",
  sanity_token: System.get_env("SANITY_TOKEN") || "",
  sanity_api_version: System.get_env("SANITY_API_VERSION") || "2021-06-07",
  query_url: "query/"

config :os_mon,
  disk_space_check_interval: 60,
  memory_check_interval: 2,
  disk_almost_full_threshold: 0.90,
  start_cpu_sup: false

import Mix.Config

config :hexerei,
  port: System.get_env("PORT") || 4444,
  api_version: System.get_env("API_VERSION") || "v1",
  api_token: "1234567890",
  sanity_project_id: System.get_env("SANITY_PROJECT_ID") || "",
  sanity_dataset: System.get_env("SANITY_DATASET") || "dev",
  sanity_token: System.get_env("SANITY_TOKEN") || "",
  sanity_api_version: System.get_env("SANITY_API_VERSION") || "2021-06-07"

defmodule Router.Api do
  use Plug.Router
  use Plug.ErrorHandler

  forward("/#{Application.compile_env(:hexerei, :api_version)}", to: Router.Api.V1)

  plug(:match)

  plug(:dispatch)

  match "/v:any" do
    Hexerei.Res.err(conn, 400, "Invalid version specified")
  end

  # Fallback
  match _ do
    Hexerei.Res.json(conn, 400, %{code: 400, message: "No version specified"})
  end
end

defmodule Router.Api do
  use Plug.Router
  use Plug.ErrorHandler

  if (Application.compile_env(:hexerei, :env)) == "dev" do
    plug(Plug.Debugger)
  else
    plug(Plug.Logger)
  end

  forward("/#{Application.compile_env(:hexerei, :api_version)}", to: Router.Api.V1)

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  plug(:dispatch)

  defp json_res(conn, status, res) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(res))
  end

  # Fallback
  match _ do
    json_res(conn, 400, %{code: 400, message: "No version specified"})
  end
end

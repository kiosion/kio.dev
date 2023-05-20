defmodule Router.Api do
  use Plug.Router
  use Plug.ErrorHandler
  use Hexerei.Response

  forward "/v1", to: Router.Api.V1

  plug :match
  plug :dispatch

  match "/v:any" do
    conn |> error_res(400, "Invalid version specified")
  end

  match _ do
    conn |> error_res(400, "No version specified")
  end
end

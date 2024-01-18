defmodule Router.Api.V1 do
  @moduledoc """
  Plug router to handle all API V1 requests
  """

  use Router.Api.Base, auth: true, query_params: false

  @query_url Hexerei.Env.get!(:query_url)

  @routes %{
    "/post" => Router.Api.V1.Post,
    "/posts" => Router.Api.V1.Posts,
    "/project" => Router.Api.V1.Project,
    "/projects" => Router.Api.V1.Projects,
    "/tag" => Router.Api.V1.Tag,
    "/tags" => Router.Api.V1.Tags
  }

  for {path, handler} <- @routes do
    forward(@query_url <> path, to: handler)
  end

  forward("/config", to: Router.Api.V1.Config)
  forward("/inc", to: Router.Api.V1.Inc)

  match _ do
    conn
    |> error_res(404, "Not found", [
      %{message: "The requested resource could not be found or does not exist"}
    ])
    |> halt()
  end
end

defmodule Router.Api.V1.Project do
  use Router.Api.Base

  options "/:id" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  get "/:id" do
    with params <-
           validate_query_params(
             Map.merge(
               fetch_query_params(conn).query_params,
               %{"id" => conn.params["id"]}
             ),
             %{
               "id" => nil,
               "lang" => "en",
               "preview" => false
             }
           ) do
      query =
        Query.new(%{:include_drafts => params["preview"]})
        |> Query.filter([
          %{"_type" => "'project'"},
          [%{"_id" => "'#{params["id"]}'"}, %{"slug.current" => "'#{params["id"]}'"}]
        ])
        |> Query.project([
          "_id",
          "_type",
          "_rev",
          "views",
          "body",
          "desc",
          "date",
          "images",
          "links",
          "github",
          %{
            "tags[]" => [
              "_id",
              "title",
              "slug"
            ],
            :join => "->"
          },
          "slug",
          "title",
          ["'numberOfCharacters'", "length(pt::text(body))"],
          ["'estimatedWordCount'", "round(length(pt::text(body)) / 5)"],
          ["'estimatedReadingTime'", "round(length(pt::text(body)) / 5 / 120)"]
        ])
        |> Query.qualify("[0]")
        |> Query.build()

      conn
      |> handle_sanity_fetch(query, fn conn, result, duration ->
        {transformed_result, meta, code} =
          transform_result_document(query, result, :project, params)

        update_meta_and_send_response(conn, code, transformed_result, meta, duration)
      end)
    else
      false ->
        conn |> error_res(400, "Invalid request", [%{message: "Invalid or missing parameters"}])
    end
  end
end

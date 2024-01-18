defmodule Router.Api.V1.Post do
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
          %{"_type" => "'post'"},
          [
            %{"_id" => "'#{params["id"]}'"},
            %{"slug.current" => "'#{params["id"]}'"},
            %{:join => "||"}
          ]
        ])
        |> Query.project([
          "_id",
          "_rev",
          "_type",
          "title",
          "views",
          %{
            "tags[]" => [
              "_id",
              "title",
              "slug"
            ],
            :join => "->"
          },
          "slug",
          "body",
          "desc",
          "date",
          ["'numberOfCharacters'", "length(pt::text(body))"],
          ["'estimatedWordCount'", "round(length(pt::text(body)) / 5)"],
          ["'estimatedReadingTime'", "round(length(pt::text(body)) / 5 / 120)"]
        ])
        |> Query.qualify("[0]")
        |> Query.build!()

      conn
      |> handle_sanity_fetch(query, fn conn, result, duration ->
        {transformed_result, meta, code} =
          transform_result_document(query, result, :post, params)

        update_meta_and_send_response(conn, code, transformed_result, meta, duration)
      end)
    else
      _ ->
        conn |> error_res(400, "Invalid request", [%{message: "Invalid or missing parameters"}])
    end
  end
end

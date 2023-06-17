defmodule Router.Api.V1.Tag do
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
    with true <- is_binary(id),
         true <- String.trim(id) != "",
         params <-
           fetch_query_params(conn).query_params |> validate_query_params(%{"type" => nil}),
         true <- params["type"] in ["post", "project"] do
      query =
        Query.new()
        |> Query.filter([
          %{
            "_type" => "'#{params["type"]}'"
          },
          %{
            "references" =>
              Query.new()
              |> Query.filter(["_type", "'tag'"])
              |> Query.filter(["slug.current", "'#{id}'"])
              |> Query.project(["_id"])
              |> Query.build!(),
            :nest => true
          }
        ])
        |> Query.project([
          "_id",
          ["'objectID'", "_id"],
          "_rev",
          "_type",
          "title",
          "publishedAt",
          %{
            "'author'" => [
              ["'_id'", ["author", "_id", :follow]],
              ["'_type'", ["author", "_type", :follow]],
              ["'name'", ["author", "name", :follow]],
              ["'slug'", ["author", "slug", :follow]],
              ["'image'", ["author", "image", :follow]]
            ]
          },
          %{
            "tags[]" => [
              "_id",
              "title",
              "slug"
            ],
            :follow => true
          },
          "slug",
          "body",
          "desc",
          "date",
          ["'numberOfCharacters'", "length(pt::text(body))"],
          ["'estimatedWordCount'", "round(length(pt::text(body)) / 5)"],
          ["'estimatedReadingTime'", "round(length(pt::text(body)) / 5 / 120)"]
        ])
        |> Query.build!()

      counts =
        Task.async(fn ->
          conn
          |> handle_sanity_fetch(
            Query.new(%{:direct_query => true})
            |> Query.project([["'total'", "count(#{query})"]])
            |> Query.build!(),
            fn _, result -> result end
          )
        end)

      conn
      |> handle_sanity_fetch(query, fn conn, result, duration ->
        parsed_counts = Task.await(counts)

        result
        |> Map.put("meta", %{
          "total" => parsed_counts["result"]["total"] || 0,
          "count" => parsed_counts["result"]["total"] || 0,
          "id" => id,
          "type" => params["type"]
        })
        |> Map.update("ms", duration, &(&1 + (duration - &1)))
        |> (fn data -> conn |> json_res(200, %{code: 200, data: data}) end).()
      end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Missing ID or invalid type")
    end
  end
end

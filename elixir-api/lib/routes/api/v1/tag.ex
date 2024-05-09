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
         {:ok, params} <-
           validate_query_params(conn, %{"type" => nil}),
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
          "_rev",
          "_type",
          "title",
          "views",
          "publishedAt",
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

        {transformed_result, meta, code} =
          transform_result_document(
            query,
            result,
            String.to_atom(params["type"] <> "s"),
            params,
            %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["count"]
            }
          )

        # parsed_counts = Task.await(counts)

        # {transformed_result, meta, code} =
        #   transform_result_document(query, result, :tag, params, %{
        #     "total" => parsed_counts["result"]["total"],
        #     "count" => parsed_counts["result"]["count"],
        #     "id" => id,
        #     "type" => params["type"]
        #   })

        update_meta_and_send_response(conn, code, transformed_result, meta, duration)
      end)
    else
      false ->
        {:ok, params} = validate_query_params(conn, %{"type" => nil})
        Logger.info("type param: #{inspect(params["type"])}")
        Logger.info("ID: #{inspect(id)}")
        conn |> error_res(400, "Invalid request", [%{message: "Missing ID or invalid type"}])

      {:error, reason} ->
        conn
        |> error_res(400, "Invalid request", [
          %{message: "Invalid or malformed params", detail: reason}
        ])
    end
  end
end

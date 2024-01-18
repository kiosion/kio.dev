defmodule Router.Api.V1.Posts do
  use Router.Api.Base

  options "/" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  get "/" do
    with {:ok, params} <-
           validate_query_params(conn, %{
             "limit" => 10,
             "skip" => 0,
             "s" => "date",
             "o" => "desc",
             "date" => nil,
             "tags" => nil,
             "lang" => "en"
           })
           |> params_to_integer([:limit, :skip])
           |> empty_to_nil([:date]),
         true <- params["limit"] >= 0 and params["skip"] >= 0 do
      query =
        Query.new()
        |> Query.filter(%{"_type" => "'post'"})
        |> (fn q ->
              if params["date"] == nil,
                do: q,
                else: q |> Query.filter(%{"date" => ["<=", "'#{params["date"]}'"]})
            end).()
        |> (fn q ->
              if params["tags"] == nil,
                do: q,
                else:
                  q |> Query.filter(%{"tags[]->slug.current" => ["match", "'#{params["tags"]}'"]})
            end).()
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

      query_limited =
        query
        |> Query.limit({params["skip"], params["limit"]})
        |> Query.order("#{params["s"]} #{params["o"]}")
        |> Query.build!()

      query = query |> Query.build!()

      counts =
        Task.async(fn ->
          conn
          |> handle_sanity_fetch(document_counts_query(query, query_limited), fn _, result ->
            result
          end)
        end)

      conn
      |> handle_sanity_fetch(query_limited, fn conn, result, duration ->
        parsed_counts = Task.await(counts)

        {transformed_result, meta, code} =
          transform_result_document(query, result, :posts, params, %{
            "total" => parsed_counts["result"]["total"],
            "count" => parsed_counts["result"]["count"]
          })

        update_meta_and_send_response(conn, code, transformed_result, meta, duration)
      end)
    else
      false ->
        conn
        |> error_res(400, "Invalid request", [
          %{
            message: "Invalid or malformed params",
            detail: "Limit and skip must be positive integers"
          }
        ])

      {:error, reason} ->
        conn
        |> error_res(400, "Invalid request", [
          %{message: "Invalid or malformed params", detail: reason}
        ])
    end
  end
end

defmodule Router.Api.V1.Tags do
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
    with params <-
           fetch_query_params(conn).query_params
           |> validate_query_params(%{
             "type" => nil,
             "limit" => 10,
             "skip" => 0,
             "s" => "title",
             "o" => "asc"
           })
           |> params_to_integer([:limit, :skip]),
         true <- params["limit"] >= 0 and params["skip"] >= 0 do
      query =
        Query.new()
        |> Query.filter(%{"_type" => "'tag'"})
        |> Query.project([
          "_id",
          "_rev",
          ["'objectID'", "_id"],
          "_type",
          "title",
          "slug"
        ])

      query =
        case params["type"] do
          nil ->
            query

          _ ->
            query
            |> Query.project([
              [
                "'referencedBy'",
                Query.new()
                |> Query.filter([
                  %{"_type" => "'#{params["type"]}'"},
                  %{"references" => "^._id", :nest => true}
                ])
                |> Query.project([
                  "_id"
                ])
                |> Query.build!()
              ]
            ])
        end

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
          transform_result_document(query, result, :tag, params, %{
            "total" => parsed_counts["result"]["total"],
            "count" => parsed_counts["result"]["count"]
          })

        update_meta_and_send_response(conn, code, transformed_result, meta, duration)
      end)
    else
      false -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end
end

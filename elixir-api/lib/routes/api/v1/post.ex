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
               "lang" => "en"
             }
           ) do
      query =
        Query.new()
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
        count =
          case result["result"] do
            nil -> 0
            _ -> 1
          end

        transformed_result =
          case params["lang"] do
            "en" -> result
            "fr" -> Translate.translate(:post, result, "fr", "en")
            _ -> conn |> error_res(400, "Invalid request", "Invalid language") |> halt()
          end

        case transformed_result do
          {:error, message} ->
            Logger.error("Error fetching post: #{inspect(message)}")
            result

          _ ->
            transformed_result
        end
        |> Map.put("meta", %{
          "total" => count,
          "count" => count,
          "id" =>
            if result["result"] != nil do
              params["id"]
            else
              nil
            end
        })
        |> Map.update("ms", duration, &(&1 + (duration - &1)))
        |> (fn data -> conn |> json_res(200, %{code: 200, data: data}) end).()
      end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end
end

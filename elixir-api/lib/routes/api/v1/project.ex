defmodule Router.Api.V1.Project do
  use Router.Api.Base

  alias Hexerei.PT

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
          ["'objectID'", "_id"],
          "_type",
          "_rev",
          %{
            "'author'" => [
              ["'_id'", ["author", "_id", :follow]],
              ["'_type'", ["author", "_type", :follow]],
              ["'name'", ["author", "name", :follow]],
              ["'slug'", ["author", "slug", :follow]],
              ["'image'", ["author", "image", :follow]]
            ]
          },
          "body",
          "desc",
          "date",
          "external",
          "externalAuthor",
          "externalLinks",
          "externalUrl",
          "image",
          "language",
          %{
            "tags[]" => [
              "_id",
              "title",
              "slug"
            ],
            :join => "->"
          },
          "slug",
          "title"
        ])
        |> Query.qualify("[0]")
        |> Query.build()

      conn
      |> handle_sanity_fetch(query, fn conn, result, duration ->
        count =
          case result["result"] do
            nil -> 0
            _ -> 1
          end

        translated_result =
          case params["lang"] do
            "en" -> result
            "fr" -> Translate.translate(:project, result, "fr", "en")
            _ -> conn |> error_res(400, "Invalid request", "Invalid language") |> halt()
          end
          |> case do
            {:error, message} ->
              Logger.error("Error translating post: #{inspect(message)}")
              result

            translated_result ->
              translated_result
          end

        code =
          if count == 0 do
            404
          else
            200
          end

        case count do
          0 ->
            translated_result

          _ ->
            Kernel.put_in(
              translated_result,
              ["result", "headings"],
              PT.build_summary(translated_result["result"]["body"])
            )
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
        |> (fn data -> conn |> json_res(code, %{code: code, data: data}) end).()
      end)
    else
      false -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end
end

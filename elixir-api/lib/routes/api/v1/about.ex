defmodule Router.Api.V1.About do
  use Router.Api.Base

  options "/" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=7200, must-revalidate")
    |> send_resp(200, "")
  end

  get "/" do
    with params <-
           validate_query_params(
             fetch_query_params(conn).query_params,
             %{
               "id" => nil,
               "lang" => "en"
             }
           ) do
      conn
      |> handle_sanity_fetch(
        Query.new()
        |> Query.filter([
          %{"_type" => "'author'"},
          %{"_id" => "'me'"}
        ])
        |> Query.project([
          "_id",
          ["'objectID'", "_id"],
          "_rev",
          "_type",
          "at",
          "bio",
          "body",
          "now",
          "location",
          "contact",
          "fullname",
          %{
            "timeline[]" => [
              "title",
              "subtitle",
              "range",
              %{
                "skills[]" => [
                  "_id",
                  "title",
                  "slug"
                ],
                :join => "->"
              },
              "body"
            ],
            :join => ""
          },
          "image",
          "name"
        ])
        |> Query.qualify("[0]")
        |> Query.build!(),
        fn conn, result ->
          transformed_result =
            case params["lang"] do
              "en" -> result
              "fr" -> Translate.translate(:about, result, "fr", "en")
              _ -> conn |> error_res(400, "Invalid request", "Invalid language") |> halt()
            end

          case transformed_result do
            {:error, message} ->
              Logger.error("Error fetching about: #{inspect(message)}")
              result

            _ ->
              transformed_result
          end
          |> Map.delete("ms")
          |> Map.delete("query")
          |> (fn data -> conn |> json_res(200, %{code: 200, data: data}) end).()
        end
      )
    else
      _ -> conn |> error_res(400, "Invalid request", "Unknown error collecting params")
    end
  end
end

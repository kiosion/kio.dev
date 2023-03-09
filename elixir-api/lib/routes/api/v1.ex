defmodule Router.Api.V1 do
  @moduledoc """
  Plug router to handle all API V1 requests
  """

  use Plug.Router
  use Plug.ErrorHandler

  use Hexerei.Response
  use Hexerei.Utils

  require Logger

  alias Hexerei.SanityClient, as: Sanity
  alias Hexerei.SanityClient.Query, as: Query
  alias Hexerei.Translate

  @query_url Hexerei.Env.get!(:query_url)

  plug(:match)

  plug(Hexerei.Plug.VerifyRequest)

  plug(:fetch_query_params)

  plug(:dispatch)

  def handle_sanity_fetch(conn, query, cb, init_duration \\ nil) do
    start = System.system_time(:millisecond)
    with {:ok, result} <- Sanity.fetch(query) do
      duration = case init_duration do
        nil -> System.system_time(:millisecond) - start
        _ -> System.system_time(:millisecond) - start + init_duration
      end
      case :erlang.fun_info(cb, :arity) do
        {:arity, 3} -> cb.(conn, Poison.decode!(result), duration)
        _ -> cb.(conn, Poison.decode!(result))
      end
    else
      {:error, error} ->
        Logger.error("Sanity fetch failed: #{inspect error}")
        conn |> generic_error(error.message)
    end
  end

  defp limit_query(query, params) do
    case params["limit"] > 0 do
      true -> query <> " | order(#{params["s"]} #{params["o"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"
      false -> query <> " | order(#{params["s"]} #{params["o"]})"
    end
  end

  defp document_counts_query(query), do: "{ 'total': count(#{query}) }"
  defp document_counts_query(query, limited_query), do: "{ 'total': count(#{query})#{if limited_query do ", 'count': count(#{limited_query})" else "" end}}"

  options "#{@query_url}/post/:id" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  get "#{@query_url}/post/:id" do
    with params <- validate_query_params(
                      Map.merge(
                        fetch_query_params(conn).query_params,
                        %{ "id" => conn.params["id"] }
                      ),
                      %{
                        "id" => nil,
                        "lang" => "en"
                      }
                    )
    do
      query = Query.new()
        |> Query.filter([
          %{ "_type" => "'post'" },
          [
            %{ "_id" => "'#{params["id"]}'" },
            %{ "slug.current" => "'#{params["id"]}'" },
            %{ :join => "||" }
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

        conn |> handle_sanity_fetch(query, fn (conn, result, duration) ->
          transformed_result = case params["lang"] do
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
                "total" => 1,
                "count" => 1,
                "id" => params["id"]
              })
            |> Map.update("ms", duration, &(&1 + (duration - &1)))
            |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
        end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end

  options "#{@query_url}/posts" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  get "#{@query_url}/posts" do
    with params <- fetch_query_params(conn).query_params
                    |> validate_query_params(%{
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
         true   <- params["limit"] >= 0 and params["skip"] >= 0
    do
      query = Query.new()
        |> Query.filter(%{
            "_type" => "'post'"
          })

      query = case params["date"] do
        nil -> query
        _ -> query
          |> Query.filter(%{
              "date" => "'#{params["date"]}'"
            })
      end
      query = case params["tags"] do
        nil -> query
        _ -> query
          |> Query.filter(%{
              "tags[]->slug.current" => ["match", "'#{params["tags"]}'"]
            })
      end

      query = query
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

        query_limited = query
          |> Query.limit({params["skip"], params["limit"]})
          |> Query.order("#{params["s"]} #{params["o"]}")
          |> Query.build!()

        query = query |> Query.build!()

        counts = Task.async(fn ->
          conn |> handle_sanity_fetch(document_counts_query(query, query_limited), fn (_, result) ->
            result
          end)
        end)

        conn |> handle_sanity_fetch(query_limited, fn (conn, result, duration) ->
          parsed_counts = Task.await(counts)

          transformed_result = case params["lang"] do
            "en" -> result
            "fr" -> Translate.translate(:posts, result, "fr", "en")
            _ -> conn |> error_res(400, "Invalid request", "Invalid language") |> halt()
          end

          case transformed_result do
            {:error, message} ->
              Logger.error("Error fetching posts: #{inspect(message)}")
              result
            _ ->
              transformed_result
          end
          |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["count"],
              "sort" => params["s"],
              "order" => params["o"]
            })
          |> Map.update("ms", duration, &(&1 + (duration - &1)))
          |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
        end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end

  options "#{@query_url}/project/:id" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  get "#{@query_url}/project/:id" do
    with params <- validate_query_params(%{ "id" => id }, %{ "id" => nil }),
         true <- not is_nil(params["id"])
    do
      query = Query.new()
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

      conn |> handle_sanity_fetch(query, fn (conn, result, duration) ->
        count = case result["result"] do
          nil -> 0
          _ -> 1
        end
        result
          |> Map.put("meta", %{
              "total" => count,
              "count" => count,
              "id" => params["id"]
            })
          |> Map.update("ms", duration, &(&1 + (duration - &1)))
          |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
      end)
    else
      false -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end

  options "#{@query_url}/projects" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  get "#{@query_url}/projects" do
    with params <- fetch_query_params(conn).query_params
                    |> validate_query_params(%{
                        "limit" => 10,
                        "skip" => 0,
                        "s" => "date",
                        "o" => "desc",
                        "date" => nil,
                        "tags" => nil
                      })
                    |> params_to_integer([:limit, :skip])
                    |> empty_to_nil([:date]),
         true   <- params["limit"] >= 0 and params["skip"] >= 0
    do
      query = Query.new()
        |> Query.filter(%{
            "_type" => "'project'"
          })

      query = case params["date"] do
        nil -> query
        _ -> query
          |> Query.filter(%{
              "date" => ["<=", "'#{params["date"]}'"]
            })
      end
      query = case params["tags"] do
        nil -> query
        _ -> query
          |> Query.filter(%{
              "tags[]->slug.current" => ["match", "'#{params["tags"]}'"]
            })
      end

      query = query |> Query.project([
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

      query_limited = query
        |> Query.limit({params["skip"], params["limit"]})
        |> Query.order("#{params["s"]} #{params["o"]}")
        |> Query.build!()

      query = query |> Query.build!()

      counts = Task.async(fn ->
        conn |> handle_sanity_fetch(document_counts_query(query, query_limited), fn (_, result) ->
          result
        end)
      end)

      conn |> handle_sanity_fetch(query_limited, fn (conn, result, duration) ->
        parsed_counts = Task.await(counts)

        result
          |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["count"],
              "sort" => params["s"],
              "order" => params["o"]
            })
          |> Map.update("ms", duration, &(&1 + (duration - &1)))
          |> Map.delete("query")
          |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
      end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end

  options "#{@query_url}/tags" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  # All tags
  get "#{@query_url}/tags" do
    with params <- fetch_query_params(conn).query_params
                     |> validate_query_params(%{
                          "type" => nil,
                          "limit" => 10,
                          "skip" => 0,
                          "s" => "title",
                          "o" => "asc"
                        })
                     |> params_to_integer([:limit, :skip]),
         true   <- params["limit"] >= 0 and params["skip"] >= 0
    do
      query = Query.new()
        |> Query.filter(%{"_type" => "'tag'"})
        |> Query.project([
          "_id",
          "_rev",
          ["'objectID'", "_id"],
          "_type",
          "title",
          "slug"
        ])

      query = case params["type"] do
        nil ->
          query
        _ ->
          query |> Query.project([
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

      query_limited = query
        |> Query.limit({params["skip"], params["limit"]})
        |> Query.order("#{params["s"]} #{params["o"]}")
        |> Query.build!()

      query = query |> Query.build!()

      counts = Task.async(fn ->
        conn |> handle_sanity_fetch(document_counts_query(query, query_limited), fn (_, result) ->
          result
        end)
      end)

      conn |> handle_sanity_fetch(query_limited, fn (conn, result, duration) ->
          parsed_counts = Task.await(counts)

          result
            |> Map.put("meta", %{
                "total" => parsed_counts["result"]["total"],
                "count" => parsed_counts["result"]["count"],
                "sort" => params["s"],
                "order" => params["o"]
              })
            |> Map.update("ms", duration, &(&1 + (duration - &1)))
            |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
      end)
    else
      false -> conn |> error_res(400, "Invalid request", "Invalid or missing parameters")
    end
  end

  options "#{@query_url}/tag/:id" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=3600, must-revalidate")
    |> send_resp(200, "")
  end

  # Documents belonging to tag
  get "#{@query_url}/tag/:id" do
    with true   <- is_binary(id),
         true   <- String.trim(id) != "",
         params <- fetch_query_params(conn).query_params |> validate_query_params(%{ "type" => nil }),
         true   <- params["type"] in ["post", "project"] do

      query = Query.new()
        |> Query.filter([%{
            "_type" => "'#{params["type"]}'"
          },
          %{
            "references" => Query.new()
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

      counts = Task.async(fn ->
        conn |> handle_sanity_fetch(
          Query.new(%{:direct_query => true})
          |> Query.project([["'total'", "count(#{query})"]])
          |> Query.build!(),
          fn (_, result) -> result
        end)
      end)

      conn |> handle_sanity_fetch(query, fn (conn, result, duration) ->
        parsed_counts = Task.await(counts)

        result
          |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"] || 0,
              "count" => parsed_counts["result"]["total"] || 0,
              "id" => id,
              "type" => params["type"]
            })
          |> Map.update("ms", duration, &(&1 + (duration - &1)))
          |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
      end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Missing ID or invalid type")
    end
  end

  options "#{@query_url}/about" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=7200, must-revalidate")
    |> send_resp(200, "")
  end

  get "#{@query_url}/about" do
    with params <- validate_query_params(
                    fetch_query_params(conn).query_params,
                    %{
                      "id" => nil,
                      "lang" => "en"
                    }
                  )
    do
      conn |> handle_sanity_fetch(
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
                %{"skills[]" => [
                  "_id",
                  "title",
                  "slug"
                ], :join => "->"},
                "body"
              ],
              :join => "",
            },
            "image",
            "name"
          ])
          |> Query.qualify("[0]")
          |> Query.build!(),
        fn (conn, result) ->
          transformed_result = case params["lang"] do
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
            |> fn data -> conn |> json_res(200, %{code: 200, data: data }) end.()
        end
      )
    else
      _ -> conn |> error_res(400, "Invalid request", "Unknown error collecting params")
    end
  end

  options "/config" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=7200, must-revalidate")
    |> send_resp(200, "")
  end

  get "/config" do
    conn |> handle_sanity_fetch(
      Query.new()
        |> Query.filter([%{ "_type" => "'siteSettings'" }])
        |> Query.qualify("[0]")
        |> Query.build!(),
      fn (conn, result) ->
        result
          |> Map.delete("ms")
          |> fn data -> conn |> json_res(200, %{code: 200, data: data }) end.()
      end
    )
  end

  # Fallback
  match _ do
    conn |> error_res(404, "Not found", "The requested resource could not be found or does not exist")
  end
end

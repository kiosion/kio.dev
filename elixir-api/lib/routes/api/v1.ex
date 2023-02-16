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
  alias Hexerei.BuildQuery, as: BuildQuery

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

  get "#{@query_url}/post/:id" do
    params = validate_query_params(%{
        "id" => id
      }, %{
        "id" => nil
      })

    conn |> handle_sanity_fetch(BuildQuery.postSingle(params["id"]), fn (conn, result, duration) ->
      result
        |> Map.put("meta", %{
            "total" => 1,
            "count" => 1,
            "id" => params["id"]
          })
        |> Map.update("ms", duration, &(&1 + (duration - &1)))
        |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
    end)
  end

  get "#{@query_url}/posts" do
    params = fetch_query_params(conn).query_params
      |> validate_query_params(%{
          "limit" => 10,
          "skip" => 0,
          "s" =>
          "date",
          "o" =>
          "desc",
          "date" => nil,
          "tags" => nil
        })
      |> params_to_integer([:limit, :skip])
      |> empty_to_nil([:date])

    query = BuildQuery.postMany(params["date"], params["tags"])
    query_limited = query |> limit_query(params)

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
  end

  get "#{@query_url}/project/:id" do
    params = validate_query_params(%{
        "id" => id
      }, %{
        "id" => nil
      })

    conn |> handle_sanity_fetch(BuildQuery.projectSingle(params["id"]), fn (conn, result, duration) ->
      result
        |> Map.put("meta", %{
            "total" => 1,
            "count" => 1,
            "id" => params["id"]
          })
        |> Map.update("ms", duration, &(&1 + (duration - &1)))
        |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
    end)
  end

  get "#{@query_url}/projects" do
    params = fetch_query_params(conn).query_params
      |> validate_query_params(%{
          "limit" => 10,
          "skip" => 0,
          "s" => "date",
          "o" => "desc",
          "date" => nil,
          "tags" => nil
        })
      |> params_to_integer([:limit, :skip])
      |> empty_to_nil([:date])

    query = BuildQuery.projectMany(params["date"], params["tags"])
    query_limited = query |> limit_query(params)

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
  end

  # All tags
  get "#{@query_url}/tags" do
    params = fetch_query_params(conn).query_params
      |> validate_query_params(%{
          "type" => nil,
          "limit" => 10,
          "skip" => 0,
          "s" => "title",
          "o" => "asc"
        })
      |> params_to_integer([:limit, :skip])

    query = BuildQuery.tags(params["type"])
    query_limited = query |> limit_query(params)

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
  end

  # Documents belonging to tag
  get "#{@query_url}/tag/:id" do
    with true <- is_binary(id),
         true <- String.trim(id) != "" do
      params = fetch_query_params(conn).query_params
        |> validate_query_params(%{
            "type" => nil
          })

      query = BuildQuery.tag(id, params["type"])

      counts = Task.async(fn ->
        conn |> handle_sanity_fetch(document_counts_query(query), fn (_, result) ->
          result
        end)
      end)

      conn |> handle_sanity_fetch(query, fn (conn, result, duration) ->
        parsed_counts = Task.await(counts)

        result
          |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["total"],
              "id" => id,
              "type" => params["type"]
            })
          |> Map.update("ms", duration, &(&1 + (duration - &1)))
          |> Map.delete("query")
          |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
      end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Missing tag ID")
    end
  end

  # Comments referencing document
  get "#{@query_url}/comments/:id" do
    with true <- is_binary(id),
         true <- String.trim(id) != "" do
      params = fetch_query_params(conn).query_params
        |> validate_query_params(%{
            "force" => false
          })

      query = BuildQuery.commentsOn(id, params["force"])

      conn |> handle_sanity_fetch(query, fn (conn, result, duration) ->
        result
          |> Map.put("meta", %{
            "id" => id
          })
          |> Map.update("ms", duration, &(&1 + (duration - &1)))
          |> fn data -> conn |> json_res(200, %{code: 200, data: data}) end.()
      end)
    else
      _ -> conn |> error_res(400, "Invalid request", "Missing document ID")
    end
  end

  get "#{@query_url}/about" do
    conn |> handle_sanity_fetch(BuildQuery.about(), fn (conn, result) ->
      result
        |> Map.delete("ms")
        |> Map.delete("query")
        |> fn data -> conn |> json_res(200, %{code: 200, data: data }) end.()
    end)
  end

  get "#{@query_url}/now" do
    conn |> error_res(404, "Not found")
    # conn |> handle_sanity_fetch(BuildQuery.nowPage(), fn (conn, result) ->
    #   Poison.decode!(result)
    #     |> Map.delete("ms")
    #     |> Map.delete("query")
    #     |> fn data -> conn |> json_res(200, %{code: 200, data: data }) end.()
    # end)
  end

  get "/config" do
    conn |> handle_sanity_fetch(BuildQuery.config(), fn (conn, result) ->
      result
        |> Map.delete("ms")
        |> Map.delete("query")
        |> fn data -> conn |> json_res(200, %{code: 200, data: data }) end.()
    end)
  end

  # Fallback
  match _ do
    conn |> error_res(404, "Not found", "The requested resource could not be found or does not exist")
  end
end

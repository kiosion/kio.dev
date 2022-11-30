defmodule Router.Api.V1 do
  @moduledoc """
  Plug router to handle all API V1 requests
  """

  use Plug.Router
  use Plug.ErrorHandler

  alias Hexerei.SanityClient, as: Sanity
  alias Hexerei.BuildQuery, as: BuildQuery

  @query_url Application.compile_env!(:hexerei, :query_url)

  plug(:match)

  plug(Hexerei.Plug.VerifyRequest)

  # TODO: Hexerei.Res as plug not module
  plug(:fetch_query_params)

  plug(:dispatch)

  defp validate_query_params(params, expected) do
    # 'Expected' provided as map of keys + defaults, 'params' as map of keys + values
    Enum.reduce(expected, %{}, fn {key, default}, acc ->
      if Map.has_key?(params, key) do
        Map.put(acc, key, params[key])
      else
        Map.put(acc, key, default)
      end
    end)
  end

  ## Routes

  # GET post
  get "#{@query_url}/post/:id" do
    start = System.system_time(:millisecond)
    params = validate_query_params(%{"id" => id}, %{"id" => nil})

    case Sanity.fetch(BuildQuery.postSingle(params["id"])) do
      {:ok, result} ->
        duration = System.system_time(:millisecond) - start
        Poison.decode!(result)
          |> Map.put("meta", %{
            "total" => 1,
            "count" => 1,
            "id" => params["id"]
          })
          |> Map.update("ms", duration, &(&1 + (duration - &1)))
          |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
      {:error, error} -> Hexerei.Res.err(conn, error.code, %{message: "Something went wrong: #{error.message}"})
    end
  end

  # GET posts
  get "#{@query_url}/posts" do
    start = System.system_time(:millisecond)
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"limit" => 10, "skip" => 0, "s" => "date", "o" => "desc", "date" => nil, "tags" => nil })

    # Convert 'limit' / 'skip' to integers only if they're not nil and not already integers
    # Using String.to_int is fine here even though it throws, since without a limit/skip it's not a valid request
    # TODO: This is a bit messy, clean it up / turn into fn (... validateInts?)
    params = Enum.reduce(params, %{}, fn {key, value}, acc ->
      if key in ["limit", "skip"] do
        if value != nil and not is_integer(value) do
          Map.put(acc, key, String.to_integer(value))
        else
          Map.put(acc, key, value)
        end
      else
        Map.put(acc, key, value)
      end
    end)
    # If date is '', set to nil
    params = Map.update(params, "date", nil, &if(&1 == "", do: nil, else: &1))

    query = BuildQuery.postMany(params["date"], params["tags"])
    query_limited = if params["limit"] > 0 do
      query <> " | order(#{params["s"]} #{params["o"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"
    else
      query <> " | order(#{params["s"]} #{params["o"]})"
    end

    case Sanity.fetch(query_limited) do
      {:ok, result} ->
        case Sanity.fetch("{ 'total': count(#{query}), 'count': count(#{query_limited}) }") do
          {:ok, counts} ->
            duration = System.system_time(:millisecond) - start
            parsed_counts = Poison.decode!(counts)

            Poison.decode!(result)
            |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["count"],
              "sort" => params["s"],
              "order" => params["o"]
            })
            |> Map.update("ms", duration, &(&1 + (duration - &1)))
            |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
          {:error, error} -> Hexerei.Res.err(conn, error.code, %{message: "Something went wrong: #{error.message}"})
        end
      {:error, error} ->
        IO.inspect("Error:")
        IO.inspect(error)
        Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET project
  get "#{@query_url}/project/:id" do
    start = System.system_time(:millisecond)
    params = validate_query_params(%{"id" => id}, %{"id" => nil})

    case Sanity.fetch(BuildQuery.projectSingle(params["id"])) do
      {:ok, result} ->
        duration = System.system_time(:millisecond) - start
        Poison.decode!(result)
        |> Map.put("meta", %{
          "total" => 1,
          "count" => 1,
          "id" => params["id"]
        })
        |> Map.update("ms", duration, &(&1 + (duration - &1)))
        |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET projects
  get "#{@query_url}/projects" do
    start = System.system_time(:millisecond)

    # Same query params available as for posts
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"limit" => 10, "skip" => 0, "s" => "date", "o" => "desc", "date" => nil, "tags" => nil })

    params = Enum.reduce(params, %{}, fn {key, value}, acc ->
      if key in ["limit", "skip"] do
        if value != nil and not is_integer(value) do
          Map.put(acc, key, String.to_integer(value))
        else
          Map.put(acc, key, value)
        end
      else
        Map.put(acc, key, value)
      end
    end)

    params = Map.update(params, "date", nil, &if(&1 == "", do: nil, else: &1))

    query = BuildQuery.projectMany(params["date"], params["tags"])
    query_limited = if params["limit"] > 0 do
      query <> " | order(#{params["s"]} #{params["o"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"
    else
      query <> " | order(#{params["s"]} #{params["o"]})"
    end

    case Sanity.fetch(query_limited) do
      {:ok, result} ->
        case Sanity.fetch("{ 'total': count(#{query}), 'count': count(#{query_limited}) }") do
          {:ok, counts} ->
            duration = System.system_time(:millisecond) - start
            parsed_counts = Poison.decode!(counts)

            Poison.decode!(result)
            |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["count"],
              "sort" => params["s"],
              "order" => params["o"]
            })
            |> Map.update("ms", duration, &(&1 + (duration - &1)))
            |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
          {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
        end
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET all tags
  get "#{@query_url}/tags" do
    start = System.system_time(:millisecond)
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"type" => nil, "limit" => 10, "skip" => 0, "s" => "title", "o" => "asc"})

    params = Enum.reduce(params, %{}, fn {key, value}, acc ->
      if key in ["limit", "skip"] do
        if value != nil and not is_integer(value) do
          Map.put(acc, key, String.to_integer(value))
        else
          Map.put(acc, key, value)
        end
      else
        Map.put(acc, key, value)
      end
    end)

    query = BuildQuery.tags(params["type"])
    query_limited = if params["limit"] > 0 do
      query <> " | order(#{params["s"]} #{params["o"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"
    else
      query <> " | order(#{params["s"]} #{params["o"]})"
    end

    case Sanity.fetch(query_limited) do
      {:ok, result} ->
        case Sanity.fetch("{ 'total': count(#{query}), 'count': count(#{query_limited}) }") do
          {:ok, counts} ->
            duration = System.system_time(:millisecond) - start
            parsed_counts = Poison.decode!(counts)

            Poison.decode!(result)
            |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["count"],
              "sort" => params["s"],
              "order" => params["o"]
            })
            |> Map.update("ms", duration, &(&1 + (duration - &1)))
            |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
          {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
        end
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET documents belonging to tag
  get "#{@query_url}/tag/:id" do
    start = System.system_time(:millisecond)

    if id == nil do
      Hexerei.Res.err(conn, 400, "Missing tag id")
    end

    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"type" => nil})

    query = BuildQuery.tag(id, params["type"])

    case Sanity.fetch(query) do
      {:ok, result} ->
        case Sanity.fetch("{ 'total': count(#{query}) }") do
          {:ok, counts} ->
            duration = System.system_time(:millisecond) - start
            parsed_counts = Poison.decode!(counts)

            Poison.decode!(result)
            |> Map.put("meta", %{
              "total" => parsed_counts["result"]["total"],
              "count" => parsed_counts["result"]["total"],
              "id" => id,
              "type" => params["type"]
            })
            |> Map.update("ms", duration, &(&1 + (duration - &1)))
            |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
          {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
        end
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET about
  get "#{@query_url}/about" do
    case Sanity.fetch(BuildQuery.about()) do
      {:ok, result} ->
        Poison.decode!(result)
        |> Map.delete("ms")
        |> Map.delete("query")
        |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data }) end.()
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET site config
  get "/config" do
    case Sanity.fetch(BuildQuery.config()) do
      {:ok, result} ->
        Poison.decode!(result)
        |> Map.delete("ms")
        |> Map.delete("query")
        |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # Fallback
  match _ do
    Hexerei.Res.err(conn, 404, "Not found")
  end

  # Handle unexpected errors
  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    Hexerei.Res.err(conn, 500, "Something went wrong")
  end
end

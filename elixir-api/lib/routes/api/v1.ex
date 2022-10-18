defmodule Router.Api.V1 do
  @moduledoc """
  Plug router to handle all API V1 requests
  """

  use Plug.Router
  use Plug.ErrorHandler

  alias Hexerei.SanityClient, as: Sanity
  alias Hexerei.BuildQuery, as: BuildQuery

  @query_url Application.compile_env(:hexerei, :query_url)

  plug(:match)

  # plug(Hexerei.Plug.VerifyRequest)

  # TODO: Hexerei.Res as plug not module
  plug(:fetch_query_params)

  plug(:dispatch)

  defp parse_send_res(conn, result) do
    if result == nil do
      Hexerei.Res.json(conn, 500, %{code: 500, message: "Something went wrong"})
    else
      # TODO: need to check if result is JSON, or a single error string

      parsed_result = Poison.decode!(result)

      Hexerei.Res.json(conn, 200, %{code: 200, data: parsed_result})
    end
  end

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
    # ID may be either url slug or document ID
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"id" => nil})

    case Sanity.fetch(BuildQuery.postSingle(params["id"])) do
      {:ok, result} ->
        Poison.decode!(result)
          |> Map.put("meta", %{
            "total" => 1,
            "count" => 1,
            "id" => params["id"]
          })
          |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
      {:error, error} -> Hexerei.Res.err(conn, error.code, %{message: "Something went wrong: #{error.message}"})
    end
  end

  # GET posts
  get "#{@query_url}/posts:params" do
    # Get limit, skip, sort, order, date, tags array
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"limit" => 10, "skip" => 0, "s" => "desc", "o" => "date", "date" => nil, "tags" => nil })

    query = BuildQuery.postMany(params["limit"], params["skip"], params["s"], params["o"], params["date"], params["tags"])
    query_limited = query <> " | order(#{params["o"]} #{params["s"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"

    case Sanity.fetch(query_limited) do
      {:ok, result} ->
        case Sanity.fetch("{ 'total': count(#{query}), 'count': count(#{query_limited}) }") do
          {:ok, counts} ->
            parsed_counts = Poison.decode!(counts)

            Poison.decode!(result)
              |> Map.put("meta", %{
                "total" => parsed_counts["result"]["total"],
                "count" => parsed_counts["result"]["count"],
                "sort" => params["s"],
                "order" => params["o"]
              })
              |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
        end
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET project
  get "#{@query_url}/project/:id" do
    # ID may be either url slug or document ID
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"id" => nil, "slug" => nil})

    case Sanity.fetch(BuildQuery.projectSingle(params["id"])) do
      {:ok, result} ->
        Poison.decode!(result)
          |> Map.put("meta", %{
            "total" => 1,
            "count" => 1,
            "id" => params["id"]
          })
          |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET projects
  get "#{@query_url}/projects:params" do
    # Same query params available as for posts
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"limit" => 10, "skip" => 0, "s" => "desc", "o" => "date", "date" => nil, "tags" => nil })

    query = BuildQuery.postMany(params["limit"], params["skip"], params["s"], params["o"], params["date"], params["tags"])
    query_limited = query <> " | order(#{params["o"]} #{params["s"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"

    case Sanity.fetch(query_limited) do
      {:ok, result} ->
        case Sanity.fetch("{ 'total': count(#{query}), 'count': count(#{query_limited}) }") do
          {:ok, counts} ->
            parsed_counts = Poison.decode!(counts)

            Poison.decode!(result)
              |> Map.put("meta", %{
                "total" => parsed_counts["result"]["total"],
                "count" => parsed_counts["result"]["count"],
                "sort" => params["s"],
                "order" => params["o"]
              })
              |> fn data -> Hexerei.Res.json(conn, 200, %{code: 200, data: data}) end.()
        end
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET about
  get "#{@query_url}/about" do
    case Sanity.fetch(BuildQuery.about()) do
      {:ok, result} -> parse_send_res(conn, result)
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET site config
  get "/config" do
    case Sanity.fetch(BuildQuery.config()) do
      {:ok, result} -> parse_send_res(conn, result)
      {:error, error} -> Hexerei.Res.err(conn, error.code, "Something went wrong: #{error.message}")
    end
  end

  # GET test
  get "/test" do
    case HTTPoison.get("https://kio.sh/") do
      {:ok, %HTTPoison.Response{status_code: 418, body: body}} ->
        :timer.sleep(1000)
        IO.inspect body
        Hexerei.Res.json(conn, 200, %{code: 200, message: "Pog!"})
      {:ok, %HTTPoison.Response{status_code: 404}} ->
        :timer.sleep(1000)
        Hexerei.Res.err(conn, 404, "Not found :(")
      {:error, %HTTPoison.Error{reason: reason}} ->
        :timer.sleep(1000)
        Hexerei.Res.err(conn, 500, "Something went wrong: #{reason}")
        IO.inspect reason
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

defmodule Router.Api.V1 do
  @moduledoc """
  Plug router to handle all API V1 requests
  """

  use Plug.Router
  use Plug.ErrorHandler

  alias Hexerei.SanityClient, as: Sanity
  alias Hexerei.BuildQuery, as: BuildQuery

  if (Application.compile_env(:hexerei, :env)) == "dev" do
    plug(Plug.Debugger)
  else
    plug(Plug.Logger)
  end

  @query_url "/query"

  plug(:match)

  plug(Hexerei.Plug.VerifyRequest)

  # TODO: Hexerei.Res as plug not module
  plug(:fetch_query_params)

  plug(:dispatch)

  defp parse_send_res(conn, result) do
    if result == nil do
      Hexerei.Res.json(conn, 500, %{code: 500, message: "Something went wrong"})
    else
      # TODO: need to check if result is JSON, or a single error string

      # Parse result from JSON to Elixir map
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
    # Enum.all?(expected, fn param -> Map.has_key?(params, param) end)
  end

  # Routes
  get "#{@query_url}/post:params" do
    # ID may be either url slug or document ID
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"id" => nil, "slug" => nil})

    case Sanity.fetch(BuildQuery.postSingle(params["id"], params["slug"])) do
      {:ok, result} -> parse_send_res(conn, result)
      {:error, error} -> Hexerei.Res.err(conn, 500, %{message: "Something went wrong: #{error}"})
    end
  end

  get "#{@query_url}/posts:params" do
    params = fetch_query_params(conn).query_params
    |> validate_query_params(%{"limit" => 10, "skip" => 0, "s" => "desc", "o" => "date", "date" => nil, "tags" => nil })

    case Sanity.fetch(BuildQuery.postMany(params["limit"], params["skip"], params["s"], params["o"], params["date"], params["tags"])) do
      {:ok, result} -> parse_send_res(conn, result)
      {:error, error} -> Hexerei.Res.err(conn, 500, "Something went wrong: #{error}")
    end
  end

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

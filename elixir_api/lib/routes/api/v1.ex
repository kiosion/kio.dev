defmodule Router.Api.V1 do
  use Plug.Router
  use Plug.ErrorHandler

  alias Hexerei.SanityClient, as: Sanity
  alias Hexerei.BuildQuery, as: BuildQuery

  if (Application.compile_env(:hexerei, :env)) == "dev" do
    plug(Plug.Debugger)
  else
    plug(Plug.Logger)
  end

  plug(:match)

  plug(Hexerei.Plug.VerifyRequest)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  plug(:fetch_query_params)

  plug(:dispatch)

  defp json_res(conn, status, res) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(res))
  end

  defp parse_send_res(conn, result) do
    if result == nil do
      json_res(conn, 500, %{code: 500, message: "Something went wrong"})
    else
      # TODO: need to check if result is JSON, or a single error string

      # Parse result from JSON to Elixir map
      parsed_result = Poison.decode!(result)

      json_res(conn, 200, %{code: 200, message: "OK", data: parsed_result})
    end
  end

  # Routes
  get "/query/post:params" do
    # TODO: Implement
    # ID may be either url slug or document ID
    params = fetch_query_params(conn).query_params
    # json_res(conn, 200, %{code: 200, message: "Post params: #{params["id"]}, #{params["slug"]}"})

    # Await result from sanity.fetch()
    case Sanity.fetch(BuildQuery.singlePost(params["id"], params["slug"])) do
      {:ok, result} -> parse_send_res(conn, result)
      {:error, error} -> json_res(conn, 500, %{code: 500, message: "Something went wrong: #{error}"})
    end
  end

  get "/test" do
    case HTTPoison.get("https://kio.sh/") do
      {:ok, %HTTPoison.Response{status_code: 418, body: body}} ->
        :timer.sleep(1000)
        IO.inspect body
        json_res(conn, 200, %{code: 200, message: "Pog!"})
      {:ok, %HTTPoison.Response{status_code: 404}} ->
        :timer.sleep(1000)
        json_res(conn, 404, %{code: 404, message: "Not found :("})
      {:error, %HTTPoison.Error{reason: reason}} ->
        :timer.sleep(1000)
        json_res(conn, 500, %{code: 500, message: "Something went wrong: #{reason}"})
        IO.inspect reason
    end
  end

  # Fallback
  match _ do
    json_res(conn, 404, %{code: 404, message: "Not found"})
  end
end

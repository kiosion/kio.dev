defmodule Hexerei.Router do
  use Plug.Router
  use Plug.ErrorHandler

  if (Application.compile_env(:hexerei, :env)) == "dev" do
    plug(Plug.Debugger)
  else
    plug(Plug.Logger)
  end

  # API routes
  forward("/api", to: Router.Api)

  # CDN routes
  forward("/cdn", to: Router.Cdn)

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  plug(:dispatch)

  # Basic routes
  get "/" do
    json_res(conn, 418, %{code: 418, message: "Do I look like a coffee pot to you??"})
  end

  get "/ping" do
    json_res(conn, 200, %{code: 200, message: "pong!"})
  end

  defp json_res(conn, status, res) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(res))
  end

  # Handle Webhook events
  post "/events" do
    {status, body} =
      case conn.body_params do
        %{"events" => events} -> {200, process_events(events)}
        _ -> {422, missing_events()}
      end

    json_res(conn, status, body)
  end

  defp process_events(events) when is_list(events) do
    %{code: 200, message: "ok"}
  end

  defp process_events(_) do
    %{code: 404, message: "error"}
  end

  defp missing_events do
    %{code: 422, message: "missing events"}
  end

  # Fallback route
  match _ do
    json_res(conn, 404, %{code: 404, message: "Resource not found or method not allowed"})
  end

  # Error handling
  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    json_res(conn, conn.status, %{code: conn.status, message: "Something went wrong"})
  end
end

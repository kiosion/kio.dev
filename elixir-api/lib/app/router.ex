defmodule Hexerei.Router do
  @moduledoc """
  Main router module
  """

  use Plug.Router
  use Plug.ErrorHandler

  if (Application.compile_env(:hexerei, :env)) == "dev" do
    plug(Plug.Debugger)
  else
    plug(Plug.Logger)
  end

  forward("/api", to: Router.Api)
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
    Hexerei.Res.json(conn, 418, %{code: 418, message: "Do I look like a coffee pot to you??"})
  end

  get "/ping" do
    Hexerei.Res.json(conn, 200, %{code: 200, message: "pong!"})
  end

  # Handle Webhook events
  post "/events" do
    {status, body} =
      case conn.body_params do
        %{"events" => events} -> {200, process_events(events)}
        _ -> {422, missing_events()}
      end

      Hexerei.Res.json(conn, status, body)
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
    Hexerei.Res.json(conn, 404, %{code: 404, message: "Resource not found or method not allowed"})
  end

  # Error handling
  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    Hexerei.Res.err(conn, conn.status, "Something went wrong")
  end
end

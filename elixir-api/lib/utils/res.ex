defmodule Hexerei.Response do
  @moduledoc """
  Basic response templates
  """

  use Plug.Builder

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  defmacro __using__(_opts) do
    quote do
      import Hexerei.Response
    end
  end

  # Standard json response
  def json_res(conn, status, content) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(content))
  end

  # Standard json res for expected errors
  def error_res(conn, status, message, detail \\ nil) do
    content =
      case detail != nil do
        true -> %{code: status, message: message, detail: detail}
        _ -> %{code: status, message: message}
      end

    conn |> json_res(status, content)
  end

  # Standard json res for unexpected errors
  def generic_error(conn, detail \\ nil) do
    case detail != nil do
      true -> conn |> error_res(500, "Something went wrong", to_string(detail))
      _ -> conn |> error_res(500, "Something went wrong")
    end
  end
end

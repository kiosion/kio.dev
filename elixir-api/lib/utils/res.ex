defmodule Hexerei.Res do
  @moduledoc """
  Basic response templates
  """

  use Plug.Builder

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  # Standard json res using Conn, status code, and res content
  def json(conn, status, res) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(res))
  end

  # Standard json res for expected errors
  def err(conn, status, reason) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(%{code: status, message: reason}))
  end
end

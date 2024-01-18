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

  @doc """
  Standard json response
  """
  @spec json_res(Plug.Conn.t(), integer(), map()) :: Plug.Conn.t()
  def json_res(conn, status, content) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(content))
  end

  @doc """
  Standard json response for errors
  """
  @spec error_res(Plug.Conn.t(), integer(), String.t(), list()) :: Plug.Conn.t()
  @spec error_res(Plug.Conn.t(), integer(), String.t()) :: Plug.Conn.t()
  def error_res(conn, status, message, errors \\ []) do
    conn |> json_res(status, %{code: status, message: message, errors: errors})
  end

  @doc """
  Standard json response for errors
  """
  @spec error_res(Plug.Conn.t(), integer(), String.t(), String.t()) :: Plug.Conn.t()
  @spec error_res(Plug.Conn.t(), integer(), String.t()) :: Plug.Conn.t()
  def generic_error(conn, detail \\ nil) do
    case detail != nil do
      true -> conn |> error_res(500, "Something went wrong", [to_string(detail)])
      _ -> conn |> error_res(500, "Something went wrong")
    end
  end
end

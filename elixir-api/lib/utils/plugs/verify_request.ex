defmodule Hexerei.Plug.VerifyRequest do
  import Plug.Conn

  # alias Hexerei.JWT

  @api_token Hexerei.Env.get!(:api_token)

  def init(options) do
    options
  end

  def call(conn, _opts) do
    conn
    |> get_header()
    |> verify_request()
  end

  defp get_header(conn) do
    case get_req_header(conn, "authorization") do
      [token] -> {conn, token}
      _ -> {conn}
    end
  end

  defp verify_request({conn, "Bearer " <> token}) do
    token
    |> verify_token()
    |> case do
      {:error, message} -> Hexerei.Res.err(conn, 401, message)
      {:ok, _token} -> conn
    end
  end

  defp verify_request({conn}) do
    Hexerei.Res.err(conn, 401, "Missing authorization")
    |> halt()
  end

  defp verify_token(token) do
    case token == @api_token do
      true -> {:ok, token}
      false -> {:error, "Invalid authorization"}
    end
  end
end

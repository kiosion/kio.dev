defmodule Hexerei.Plug.VerifyRequest do
  import Plug.Conn

  @api_token Application.compile_env!(:hexerei, :api_token)

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
      {:error, message} -> unauthorized(conn, message)
      {:ok, _token} -> conn
    end
  end

  defp verify_request({conn}) do
    unauthorized(conn, "Missing authorization")
  end

  defp verify_token(token) do
    case token == @api_token do
      true -> {:ok, token}
      false -> {:error, "Invalid authorization"}
    end
  end

  defp unauthorized(conn, msg) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(401, Poison.encode!(%{ code: 401, message: msg }))
    |> halt()
  end
end

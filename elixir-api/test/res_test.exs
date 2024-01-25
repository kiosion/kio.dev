defmodule ResponseTest do
  use ExUnit.Case, async: false
  use Plug.Test

  require Hexerei.Response

  test "json_res has expected format" do
    conn =
      conn(:get, "/api/v1/")
      |> Hexerei.Response.json_res(200, %{
        message: "Hello World"
      })

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body["message"] == "Hello World"
  end

  test "error_res has expected format" do
    conn =
      conn(:get, "/api/v1/")
      |> Hexerei.Response.error_res(404, "Not Found")

    assert conn.state == :sent
    assert conn.status == 404

    body = Poison.decode!(conn.resp_body)

    assert body["code"] == 404
    assert body["message"] == "Not Found"
    assert body["errors"] == []
  end

  test "error_res has expected format with errors" do
    conn =
      conn(:get, "/api/v1/")
      |> Hexerei.Response.error_res(404, "Not Found", ["Error 1", "Error 2"])

    assert conn.state == :sent
    assert conn.status == 404

    body = Poison.decode!(conn.resp_body)

    assert body["code"] == 404
    assert body["message"] == "Not Found"
    assert body["errors"] == ["Error 1", "Error 2"]
  end

  test "generic_error has expected format" do
    conn =
      conn(:get, "/api/v1/")
      |> Hexerei.Response.generic_error()

    assert conn.state == :sent
    assert conn.status == 500

    body = Poison.decode!(conn.resp_body)

    assert body["code"] == 500
    assert body["message"] == "Something went wrong"
    assert body["errors"] == []
  end
end

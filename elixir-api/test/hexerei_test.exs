defmodule HexereiTest do
  use ExUnit.Case, async: false
  use Plug.Test

  @opts Hexerei.Router.init([])

  test "GET /" do
    conn = conn(:get, "/")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 418

    body = Poison.decode!(conn.resp_body)

    assert body["message"] == "Do I look like a coffee pot to you??"
  end

  # GET an endpoint that requires authentication, without
  # providing a token. Should be caught by Plug.VerifyRequest
  test "GET /api/v1/posts with invalid auth" do
    conn = conn(:get, "/api/v1/posts")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 401

    body = Poison.decode!(conn.resp_body)

    assert body["message"] == "Missing authorization"
  end

  # The same request with the dev token '1234567890' should succeed
  test "GET /api/v1/posts with valid auth" do
    conn = conn(:get, "/api/v1/config")
      |> put_req_header("authorization", "Bearer 1234567890")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    # We don't care about the actual response, just that it's not empty
    assert body != []
  end
end

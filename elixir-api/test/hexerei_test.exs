defmodule HexereiTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @opts Hexerei.Router.init([])

  test "GET /" do
    # Build connection with GET req to "/"
    conn = conn(:get, "/")
    # Pass conn to router
    conn = Hexerei.Router.call(conn, @opts)
    # Assert response status
    assert conn.state == :sent
    assert conn.status == 200
    assert conn.resp_body == "Hello World!"
  end
end

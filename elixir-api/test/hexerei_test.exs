defmodule HexereiTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @opts Hexerei.Router.init([])
  @bearer Hexerei.Env.get!(:api_token)

  test "GET /" do
    conn = conn(:get, "/")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 418

    body = Poison.decode!(conn.resp_body)

    assert body["message"] == "Do I look like a coffee pot to you??"
  end
end

defmodule ApiTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @opts Hexerei.Router.init([])
  @bearer Hexerei.Env.get!(:api_token)

  test "Get API endpoint with no auth" do
    conn =
      conn(:get, "/api/v1/")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 401

    body = Poison.decode!(conn.resp_body)

    assert body["message"] == "Missing authorization"
  end

  test "Get API endpoint with auth" do
    conn =
      conn(:get, "/api/v1/")
      |> put_req_header("authorization", "Bearer #{@bearer}")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 404
  end

  test "Get /config" do
    conn =
      conn(:get, "/api/v1/config")
      |> put_req_header("authorization", "Bearer #{@bearer}")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []
    assert body["data"] != nil
  end

  test "Get /posts with default params" do
    conn =
      conn(:get, "/api/v1/query/posts")
      |> put_req_header("authorization", "Bearer #{@bearer}")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []

    assert body["data"] != nil
    assert body["data"]["meta"] != nil
  end

  test "Get /posts with invalid params" do
    conn =
      conn(:get, "/api/v1/query/posts?limit=-1")
      |> put_req_header("authorization", "Bearer #{@bearer}")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 400

    body = Poison.decode!(conn.resp_body)

    assert body != []

    assert body["data"] == nil
    assert body["message"] == "Invalid request"
    assert body["detail"] == "Invalid or missing parameters"
  end

  test "Get all tags" do
  end

  test "Get about" do
    conn =
      conn(:get, "/api/v1/query/about")
      |> put_req_header("authorization", "Bearer #{@bearer}")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []

    assert body["data"] != nil
  end
end

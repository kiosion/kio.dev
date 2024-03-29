defmodule ApiTest do
  use ExUnit.Case, async: false
  use Plug.Test

  import Mox

  @opts Hexerei.Router.init([])
  @authorization "Bearer 1234567890"

  setup :verify_on_exit!

  setup do
    Application.put_env(:hexerei, :http_client, Hexerei.HTTP.MockClient)

    on_exit(fn ->
      Application.delete_env(:hexerei, :http_client)

      Hexerei.Cache.QueryCache.clear_table()
      Hexerei.Cache.TranslateCache.clear_table()
    end)

    :ok
  end

  test "GET '/api' endpoint with no auth" do
    conn =
      conn(:get, "/api/v1/")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 401

    body = Poison.decode!(conn.resp_body)

    assert body["message"] == "Missing authorization"
  end

  test "GET '/api' endpoint with invalid auth" do
    conn =
      conn(:get, "/api/v1/")
      |> put_req_header("authorization", "blah")
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 401

    body = Poison.decode!(conn.resp_body)

    assert body["message"] == "Invalid authorization"
  end

  test "GET '/api' endpoint with auth" do
    conn =
      conn(:get, "/api/v1/")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 404
  end

  test "GET '/config' data" do
    mock_response = %HTTPoison.Response{
      body: Poison.encode!(TestFixtures.stub_config()),
      status_code: 200
    }

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      1,
      fn _url, _headers ->
        {:ok, mock_response}
      end
    )

    conn =
      conn(:get, "/api/v1/config")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []
    assert body["data"] != nil
  end

  test "GET '/query/posts' with default params" do
    mock_response = %HTTPoison.Response{
      body: Poison.encode!(TestFixtures.stub_posts()),
      status_code: 200
    }

    mock_count_response = %HTTPoison.Response{
      body: Poison.encode!(TestFixtures.stub_posts_count()),
      status_code: 200
    }

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      2,
      fn url, _headers ->
        if String.contains?(url, "count") and String.contains?(url, "total") do
          {:ok, mock_count_response}
        else
          {:ok, mock_response}
        end
      end
    )

    conn =
      conn(:get, "/api/v1/query/posts")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []

    assert body["data"] != nil
    assert body["data"]["meta"] != nil
  end

  test "GET '/query/posts' with invalid params" do
    # Should not be called
    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      0,
      fn _url, _headers ->
        flunk("Query should not be executed")
      end
    )

    conn =
      conn(:get, "/api/v1/query/posts?limit=-1")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 400

    body = Poison.decode!(conn.resp_body)

    assert body != []

    assert body["data"] == nil
    assert body["message"] == "Invalid request"

    assert body["errors"] |> List.first() == %{
             "message" => "Invalid or malformed params",
             "detail" => "Limit and skip must be positive integers"
           }
  end

  test "POST '/inc' endpoint should increment views" do
    fakeID = "some_document_id"

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :post,
      1,
      fn url, body, _params ->
        assert String.contains?(url, "mutate")
        assert String.contains?(body, "inc")
        assert String.contains?(body, fakeID)
        assert String.contains?(body, "views")

        {:ok,
         %HTTPoison.Response{
           body: Poison.encode!(%{}),
           status_code: 200
         }}
      end
    )

    conn =
      conn(:post, "/api/v1/inc/#{fakeID}", Poison.encode!(%{"target" => "views"}))
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []
    assert body["data"] != nil
  end
end

defmodule ApiTest do
  use ExUnit.Case
  use Plug.Test

  import Mox

  Code.require_file("fixtures.exs", __DIR__)

  @opts Hexerei.Router.init([])
  @authorization "Bearer 1234567890"

  setup :verify_on_exit!
  setup :set_mox_global

  Mox.defmock(Hexerei.HTTP.MockClient, for: Hexerei.HTTP.Client)

  setup do
    Application.put_env(:hexerei, :http_client, Hexerei.HTTP.MockClient)
    :ok
  end

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
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 404
  end

  test "Get /config" do
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

  test "Get /posts with default params" do
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

  test "Get /posts with invalid params" do
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
    assert body["detail"] == "Invalid or missing parameters"
  end

  test "Getting /{post,project}/:id should increment views" do
    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      1,
      fn _url, _headers ->
        {:ok,
         %HTTPoison.Response{
           body: Poison.encode!(TestFixtures.stub_post()),
           status_code: 200
         }}
      end
    )
    |> Mox.expect(
      :post,
      1,
      fn url, body, _params ->
        assert String.contains?(url, "mutate")
        assert String.contains?(body, "inc")

        {:ok,
         %HTTPoison.Response{
           body: Poison.encode!(%{}),
           status_code: 200
         }}
      end
    )

    conn =
      conn(:get, "/api/v1/query/post/abc")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    # Wait for the async task to finish
    assert_receive {:increment_view_count_done, :ok}, 5000

    body = Poison.decode!(conn.resp_body)

    assert body != []
    assert body["data"] != nil
  end

  test "Get about" do
    mock_response = %HTTPoison.Response{
      body: Poison.encode!(TestFixtures.stub_about()),
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
      conn(:get, "/api/v1/query/about")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []

    assert body["data"] != nil
  end
end

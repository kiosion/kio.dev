defmodule PostPostsTest do
  use ExUnit.Case, async: false
  use Plug.Test

  import ExUnit.CaptureLog
  import Mox

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

  @opts Hexerei.Router.init([])
  @authorization "Bearer 1234567890"

  test "GET '/query/post/:id' returns a post" do
    fakeSlug = "some_post_id_" <> Integer.to_string(System.system_time(:millisecond))

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      1,
      fn url, _headers ->
        assert String.contains?(url, fakeSlug)

        {:ok,
         %HTTPoison.Response{
           body: Poison.encode!(TestFixtures.stub_post(fakeSlug)),
           status_code: 200
         }}
      end
    )
    |> Mox.expect(
      :post,
      1,
      fn url, body, _params ->
        assert String.contains?(url, "mutate")
        assert String.contains?(body, fakeSlug)
        assert String.contains?(body, "inc")

        {:ok,
         %HTTPoison.Response{
           body: Poison.encode!(%{}),
           status_code: 200
         }}
      end
    )

    conn =
      conn(:get, "/api/v1/query/post/#{fakeSlug}")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    assert_receive {:increment_view_count_done, {:ok}}, 5000

    body = Poison.decode!(conn.resp_body)

    assert body != []
    assert body["data"] != nil
    assert body["data"]["result"]["slug"]["current"] == fakeSlug
  end

  test "GET '/query/posts' returns posts" do
    stub_posts = TestFixtures.stub_posts(["some_post_1", "some_post_2"])

    stub_posts_count =
      TestFixtures.stub_posts_count(
        count: length(stub_posts["result"]),
        total: length(stub_posts["result"])
      )

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      2,
      fn url, _headers ->
        if String.contains?(url, "count") and String.contains?(url, "total") do
          {:ok,
           %HTTPoison.Response{
             body: Poison.encode!(stub_posts_count),
             status_code: 200
           }}
        else
          {:ok,
           %HTTPoison.Response{
             body: Poison.encode!(stub_posts),
             status_code: 200
           }}
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
    assert body["data"]["result"] != nil

    assert length(body["data"]["result"]) == length(stub_posts["result"])
  end

  test "GET '/query/post/:id' with 'fr' lang should invoke Translate" do
    fakeSlug = "some_post_id_" <> Integer.to_string(System.system_time(:millisecond))

    stub_post = TestFixtures.stub_post(fakeSlug)
    stub_post_translatable_calls = 3

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      1,
      fn url, _headers ->
        assert String.contains?(url, fakeSlug)

        {:ok,
         %HTTPoison.Response{
           body: Poison.encode!(stub_post),
           status_code: 200
         }}
      end
    )
    |> Mox.expect(
      :post,
      stub_post_translatable_calls + 1,
      fn url, body, _params ->
        case url do
          "https://translation.googleapis.com/" <> _ ->
            {:ok,
             %HTTPoison.Response{
               status_code: 200,
               body:
                 Poison.encode!(%{
                   data: %{
                     translations: [
                       %{
                         translatedText: "Translated text"
                       }
                     ]
                   }
                 })
             }}

          url ->
            if String.contains?(url, "sanity.io/") do
              assert String.contains?(url, "mutate")
              assert String.contains?(body, fakeSlug)
              assert String.contains?(body, "inc")

              {:ok,
               %HTTPoison.Response{
                 body: Poison.encode!(%{}),
                 status_code: 200
               }}
            else
              flunk("Unexpected POST to URL: #{inspect(url)}")
            end
        end
      end
    )

    Application.put_env(:hexerei, :gcloud_key, "some_key")

    log_output =
      capture_log(fn ->
        conn =
          conn(:get, "/api/v1/query/post/#{fakeSlug}?lang=fr")
          |> put_req_header("authorization", @authorization)
          |> Hexerei.Router.call(@opts)

        Process.put(:temp_conn, conn)
      end)

    conn = Process.get(:temp_conn)
    Process.delete(:temp_conn)

    assert conn.state == :sent
    assert conn.status == 200

    assert_receive {:increment_view_count_done, {:ok}}, 5000

    body = Poison.decode!(conn.resp_body)

    result = body["data"]["result"]

    assert result != nil

    assert String.contains?(log_output, "No gcp key accessible for translation, skipping") ==
             false

    assert result["title"] == "Translated text"
  end

  test "GET '/query/posts' with 'fr' lang should invoke Translate for each title/description" do
    stub_posts = TestFixtures.stub_posts(["some_post_1", "some_post_2"])

    stub_posts_count =
      TestFixtures.stub_posts_count(
        count: length(stub_posts["result"]),
        total: length(stub_posts["result"])
      )

    stub_posts_translatable_calls = length(stub_posts["result"])

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      2,
      fn url, _headers ->
        if String.contains?(url, "count") and String.contains?(url, "total") do
          {:ok,
           %HTTPoison.Response{
             body: Poison.encode!(stub_posts_count),
             status_code: 200
           }}
        else
          {:ok,
           %HTTPoison.Response{
             body: Poison.encode!(stub_posts),
             status_code: 200
           }}
        end
      end
    )
    |> Mox.expect(
      :post,
      stub_posts_translatable_calls,
      fn url, body, _params ->
        assert String.contains?(url, "https://translation.googleapis.com/")

        {:ok,
         %HTTPoison.Response{
           status_code: 200,
           body:
             Poison.encode!(%{
               data: %{
                 translations: [
                   %{
                     translatedText: "Translated text"
                   }
                 ]
               }
             })
         }}
      end
    )

    Application.put_env(:hexerei, :gcloud_key, "some_key")

    log_output =
      capture_log(fn ->
        conn =
          conn(:get, "/api/v1/query/posts?lang=fr")
          |> put_req_header("authorization", @authorization)
          |> Hexerei.Router.call(@opts)

        Process.put(:temp_conn, conn)
      end)

    conn = Process.get(:temp_conn)

    assert conn.state == :sent

    body = Poison.decode!(conn.resp_body)

    Process.delete(:temp_conn)

    result = body["data"]["result"]

    assert result != nil

    assert String.contains?(log_output, "No gcp key accessible for translation, skipping") ==
             false

    assert length(result) == length(stub_posts["result"])

    assert Enum.all?(result, fn post ->
             post["title"] == "Translated text" and post["desc"] == "Translated text"
           end)
  end
end

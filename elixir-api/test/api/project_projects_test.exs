defmodule ProjectProjectsTest do
  use ExUnit.Case, async: false
  use Plug.Test

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

  test "GET '/query/project/:id' returns a project" do
    fakeSlug = "some_project_id_" <> Integer.to_string(System.system_time(:millisecond))

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
      conn(:get, "/api/v1/query/project/#{fakeSlug}")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    assert_receive {:increment_view_count_done, {:ok}}, 5000

    body = Poison.decode!(conn.resp_body)

    assert body != []
    assert body["data"] != nil
  end

  test "GET '/query/projects' returns projects" do
    stub_projects = TestFixtures.stub_projects(["some_project_1", "some_project_2"])

    stub_projects_count =
      TestFixtures.stub_projects_count(
        count: length(stub_projects["result"]),
        total: length(stub_projects["result"])
      )

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :get,
      2,
      fn url, _headers ->
        if String.contains?(url, "count") and String.contains?(url, "total") do
          {:ok,
           %HTTPoison.Response{
             body: Poison.encode!(stub_projects_count),
             status_code: 200
           }}
        else
          {:ok,
           %HTTPoison.Response{
             body: Poison.encode!(stub_projects),
             status_code: 200
           }}
        end
      end
    )

    conn =
      conn(:get, "/api/v1/query/projects")
      |> put_req_header("authorization", @authorization)
      |> Hexerei.Router.call(@opts)

    assert conn.state == :sent
    assert conn.status == 200

    body = Poison.decode!(conn.resp_body)

    assert body != []
    assert body["data"] != nil
    assert body["data"]["result"] != nil

    assert length(body["data"]["result"]) == length(stub_projects["result"])
  end
end

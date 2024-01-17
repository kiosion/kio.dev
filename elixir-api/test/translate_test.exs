defmodule TranslateTest do
  use ExUnit.Case, async: false

  import ExUnit.CaptureLog
  import Mox

  alias Hexerei.Translate

  setup :verify_on_exit!

  setup do
    Application.put_env(:hexerei, :http_client, Hexerei.HTTP.MockClient)
    Application.put_env(:hexerei, :gcloud_key, "some_key")

    on_exit(fn ->
      Application.delete_env(:hexerei, :http_client)
      Application.delete_env(:hexerei, :gcloud_key)

      Hexerei.Cache.QueryCache.clear_table()
      Hexerei.Cache.TranslateCache.clear_table()
    end)

    :ok
  end

  test "handle_translate passes through document when lang is 'en' or is invalid" do
    stub_post = TestFixtures.stub_post()

    Hexerei.HTTP.MockClient
    |> Mox.expect(
      :post,
      0,
      fn _url, _body, _params ->
        flunk("Unexpected POST call")
      end
    )

    translated_post = Translate.handle_translate(:post, stub_post, "en")

    assert translated_post == stub_post

    log_output =
      capture_log(fn ->
        invalid_translated_post = Translate.handle_translate(:post, stub_post, "invalid")

        assert invalid_translated_post == stub_post
      end)

    assert String.contains?(log_output, "Invalid language")
  end

  test "handle_translate accepts valid doctypes and returns translated content" do
    stub_config = TestFixtures.stub_config()
    stub_post = TestFixtures.stub_post()
    stub_posts = TestFixtures.stub_posts()
    stub_invalid = %{"someKey" => "someValue"}

    Hexerei.HTTP.MockClient
    |> Mox.stub(
      :post,
      fn url, _body, _params ->
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
                         translatedText: "someTranslatedText"
                       }
                     ]
                   }
                 })
             }}

          _ ->
            flunk("Unexpected POST to URL: #{inspect(url)}")
        end
      end
    )

    translated_config = Translate.handle_translate(:config, stub_config, "fr")
    translated_post = Translate.handle_translate(:post, stub_post, "fr")
    translated_posts = Translate.handle_translate(:posts, stub_posts, "fr")

    log_output =
      capture_log(fn ->
        translated_invalid = Translate.handle_translate(:invalid, stub_invalid, "fr")

        assert translated_invalid == stub_invalid
      end)

    assert String.contains?(log_output, "Error translating invalid: \"Invalid type\"")

    assert is_map(translated_config)

    assert translated_config["result"]["about"]
           |> List.first()
           |> Map.get("content")
           |> List.first()
           |> Map.get("children")
           |> List.first()
           |> Map.get("text") == "someTranslatedText"

    assert is_map(translated_post)

    assert translated_post["result"]["body"]
           |> List.first()
           |> Map.get("children")
           |> List.first()
           |> Map.get("text") == "someTranslatedText"

    assert is_map(translated_posts)
    # Posts should not have their body translated
    assert translated_posts["result"]
           |> List.first()
           |> Map.get("body")
           |> List.first()
           |> Map.get("children")
           |> List.first()
           |> Map.get("text") ==
             stub_posts["result"]
             |> List.first()
             |> Map.get("body")
             |> List.first()
             |> Map.get("children")
             |> List.first()
             |> Map.get("text")
  end
end

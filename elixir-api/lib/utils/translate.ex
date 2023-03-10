defmodule Hexerei.Translate do
  @moduledoc """
  Util to handle all translation methods
  """

  use Hexerei.Utils

  require Logger

  @gcloud_endpoint "https://translation.googleapis.com/language/translate/v2"

  defp req_url do
    @gcloud_endpoint <> "?key=" <> Hexerei.Env.get!(:gcloud_key)
  end

  defp send_request(body) do
    # Send POST request to gcloud endpoint
    with {:ok, %HTTPoison.Response{status_code: 200, body: body}} <- HTTPoison.post(req_url(), body, []) do
      try do
        {:ok, parsed_body} = Poison.decode(body)
        {:ok, parsed_body["data"]["translations"] |> Enum.map(& &1["translatedText"])}
      rescue
        e ->
          Logger.error("Error parsing gcloud response: #{inspect(e)}")
          {:error, "Error parsing response"}
      end
    else
      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        {:error, "Error sending request - #{status_code}"}
      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, reason}
      _ ->
        {:error, "Unknown error sending request"}
    end
  end

  defp construct_body(text_array, target_lang, source_lang) do
    # Construct form body for gcloud request
    {
      :form,
      [
        {"q", text_array},
        {"source", source_lang},
        {"target", target_lang},
        {"format", "text"}
      ]
    }
  end

  def translate(type, sanity_response, target_lang, source_lang \\ "en") do
    with key <- Hexerei.Env.get!(:gcloud_key),
         true <- key != nil
    do
      case type do
        :post -> translate_post(sanity_response, target_lang, source_lang)
        :posts -> translate_posts(sanity_response, target_lang, source_lang)
        # :project -> translate_project(document_or_array, target_lang, source_lang)
        # :projects -> translate_projects(document_or_array, target_lang, source_lang)
        :about -> translate_about(sanity_response, target_lang, source_lang)
        _ -> {:error, "Invalid type"}
      end
    else
      _ ->
        Logger.error("No gcloud key accessible for translation, skipping...")
        sanity_response
    end
  end

  defp translate_about(sanity_response, target_lang, source_lang) do
    document = sanity_response["result"]

    # Then, get the text fields from the document - "bio", "body", "contact", and "now"
    text_fields = document |> Map.take(["bio", "body", "contact", "now"])

    try do
      updated_fields = for {key, value} <- text_fields do
        # Since it's PortableText, each field is an array of "blocks" with "children" arrays, each possibly containing a "text" field
        text_array = get_text_from_blocks(value)

        # This sucks in terms of overhead and number of requests, but it's the only way around
        # accidentally combining separate sentences into one translation, or different marks into one string
        translations = Task.async(fn ->
          text_array
          |> Enum.map(fn text ->
            body = construct_body([text], target_lang, source_lang)
            Task.async(fn ->
              send_request(body)
            end)
          end)
          |> Enum.map(fn gcloud_response -> Task.await(gcloud_response) end)
          |> Enum.map(fn response ->
              case response do
                {:ok, translations} -> translations
                {:error, reason} ->
                  Logger.error("Error translating: #{reason}");
                  text_array
                # Fall back to the original text if the translation fails
                _ -> text_array
              end
            end)
          |> List.flatten()
        end)
        |> Task.await(12000)

        # Since they're returned as an array in the same order, we just need to find + replace
        # the text fields with the translations at the same index
        updated_blocks = replace_text_in_children(value, text_array, translations)

        {key, updated_blocks}
      end

      %{
        "result" => document |> Map.merge(updated_fields |> Enum.into(%{}))
      }
    rescue
      _ ->
        {:error, "Unhandled error or timeout while translating"}
    catch
      :exit, _ ->
        {:error, "Async task timeout while translating"}
    end
  end

  defp translate_post(sanity_response, target_lang, source_lang, only \\ ["title", "desc"]) do
    # For now, just translate the title of the post
    document = sanity_response["result"]

    # Only translate keys that are in the "only" array (they're strings in the map)
    # Temporary fix until my dumbass figures out how to not send a ridiculous amt of requests
    # For post bodies
    text_array = document |> Map.take(only) |> Map.values()

    try do
      translations = Task.async(fn ->
        text_array
        |> Enum.map(fn text ->
          body = construct_body([text], target_lang, source_lang)
          Task.async(fn ->
            send_request(body)
          end)
        end)
        |> Enum.map(fn gcloud_response -> Task.await(gcloud_response) end)
        |> Enum.map(fn response ->
            case response do
              {:ok, translations} -> translations
              {:error, reason} ->
                Logger.error("Error translating: #{reason}");
                text_array
              # Fall back to the original text if the translation fails
              _ -> text_array
            end
          end)
      end)
      |> Task.await(12000)

      # Since they'll be in the same order, but reversed, we can just pop them off the list
      updated_document = Enum.reduce(only, document, fn key, acc ->
        index = only |> Enum.find_index(fn k -> k == key end)
        {_list, [translation]} = translations |> List.pop_at(index)
        Map.put(acc, key, translation |> List.first())
      end)

      %{
        "result" => updated_document
      }
    rescue
      e ->
        {:error, "Unhandled error while translating: #{inspect(e)}"}
    end
  end

  defp translate_posts(sanity_response, target_lang, source_lang) do
    documents = sanity_response["result"]

    updated_documents = Enum.map(documents, fn document ->
      translate_post(%{"result" => document}, target_lang, source_lang)["result"]
    end)

    %{
      "result" => updated_documents
    }
  end

  defp get_text_from_blocks(blocks) do
    blocks
    |> Enum.map(fn block ->
      block["children"]
      |> Enum.map(fn child ->
        child["text"]
      end)
    end)
    |> List.flatten()
    |> Enum.reject(fn text -> text == nil end)
  end

  defp replace_text_in_children(blocks, original_text, translations) do
    blocks
    |> Enum.with_index()
    |> Enum.map(fn {block, block_index} ->
      block["children"]
      |> Enum.with_index()
      # Map over each child, while keeping track of the index
      |> Enum.map(fn {child, child_index} ->
        string_to_replace = child["text"]
        translated_replacement = translations |> Enum.at(Enum.find_index(original_text, fn text -> text == string_to_replace end))

        Map.put(child, "text", translated_replacement)
      end)
      # Replace the children array with the updated one
      |> fn updated_children -> Map.put(block, "children", updated_children) end.()
    end)
  end
end

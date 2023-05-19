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
    with {:ok, %HTTPoison.Response{status_code: 200, body: body}} <- HTTPoison.post(req_url(), body, []) do
      try do
        {:ok, parsed_body} = Poison.decode(body)
        {:ok, parsed_body["data"]["translations"] |> Enum.map(& &1["translatedText"])}
      rescue
        e ->
          Logger.error "Error parsing gcloud response: #{inspect(e)}"
          {:error, "Error parsing response"}
      end
    else
      {:ok, %HTTPoison.Response{status_code: status_code, body: _body}} ->
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
        :project -> translate_project(sanity_response, target_lang, source_lang)
        :projects -> translate_projects(sanity_response, target_lang, source_lang)
        :about -> translate_about(sanity_response, target_lang, source_lang)
        _ -> {:error, "Invalid type"}
      end
    else
      _ ->
        Logger.error "No gcp key accessible for translation, skipping..."
        sanity_response
    end
  end

  defp translate_about(sanity_response, target_lang, source_lang) do
    document = sanity_response["result"]

    text_blocks = document |> Map.take ["bio", "body", "contact", "now"]

    translated_blocks = case translate_pt_blocks text_blocks, target_lang, source_lang do
      {:ok, translated_blocks} -> translated_blocks
      {:error, reason} ->
        Logger.error "Error translating: #{reason}"
        text_blocks
    end

    %{
      "result" => document |> Map.merge(translated_blocks |> Enum.into(%{}))
    }
  end

  defp translate_post(sanity_response, target_lang, source_lang, ignore_blocks \\ false) do
    document = sanity_response["result"]

    field_names = ["title", "desc"]
    block_names = ["body"]

    text_fields = document |> Map.take(field_names) |> Map.values()
    text_blocks = document |> Map.take(block_names)

    translated_fields = case translate_pt_fields text_fields, target_lang, source_lang do
      {:ok, translated_fields} -> translated_fields
      {:error, reason} ->
        Logger.error "Error translating: #{reason}"
        text_fields
    end

    # Since field translations will be in reverse order we can just pop them off
    updated_document = Enum.reduce(field_names, document, fn key, acc ->
      index = field_names |> Enum.find_index(fn k -> k == key end)
      {_list, [translation]} = translated_fields |> List.pop_at(index)
      Map.put(acc, key, translation |> List.first())
    end)

    # For lists of posts we don't want to translate the blocks since they aren't visible anyways
    if ignore_blocks do
      %{
        "result" => updated_document
      }
    else
      translated_blocks = case translate_pt_blocks text_blocks, target_lang, source_lang do
        {:ok, translated_blocks} -> translated_blocks
        {:error, reason} ->
          Logger.error "Error translating: #{reason}"
          text_blocks
      end

      %{
        "result" => updated_document |> Map.merge(translated_blocks |> Enum.into(%{}))
      }
    end
  end

  defp translate_posts(sanity_response, target_lang, source_lang) do
    documents = sanity_response["result"]

    updated_documents = Enum.map(documents, fn document ->
      translate_post(%{"result" => document}, target_lang, source_lang, true)["result"]
    end)

    %{
      "result" => updated_documents
    }
  end

  defp translate_project sanity_response, target_lang, source_lang, ignore_blocks \\ false do
    document = sanity_response["result"]

    field_names = ["title", "desc"]
    block_names = ["body"]

    text_fields = document |> Map.take(field_names) |> Map.values()
    text_blocks = document |> Map.take(block_names)

    translated_fields = case translate_pt_fields text_fields, target_lang, source_lang do
      {:ok, translated_fields} -> translated_fields
      {:error, reason} ->
        Logger.error "Error translating: #{reason}"
        text_fields
    end

    updated_document = Enum.reduce(field_names, document, fn key, acc ->
      index = field_names |> Enum.find_index(fn k -> k == key end)
      {_list, [translation]} = translated_fields |> List.pop_at(index)
      Map.put acc, key, translation |> List.first()
    end)

    if ignore_blocks do
      %{
        "result" => updated_document
      }
    else
      translated_blocks = case translate_pt_blocks text_blocks, target_lang, source_lang do
        {:ok, translated_blocks} -> translated_blocks
        {:error, reason} ->
          Logger.error "Error translating: #{reason}"
          text_blocks
      end

      %{
        "result" => updated_document |> Map.merge(translated_blocks |> Enum.into(%{}))
      }
    end
  end

  defp translate_projects sanity_response, target_lang, source_lang do
    documents = sanity_response["result"]

    updated_documents = Enum.map(documents, fn document ->
      translate_project(%{"result" => document}, target_lang, source_lang, true)["result"]
    end)

    %{
      "result" => updated_documents
    }
  end

  defp translate_pt_fields(pt_fields, target_lang, source_lang) do
    try do
      translations = Task.async(fn ->
        pt_fields
        |> Enum.map(fn text ->
          Task.async(fn ->
            if text == "" || text == nil do
              text
            else
              construct_body([text], target_lang, source_lang) |> send_request
            end
          end)
        end)
        |> Enum.map(fn gcp_response -> Task.await gcp_response end)
        |> Enum.map(fn response ->
            case response do
              {:ok, translations} -> translations
              {:error, reason} ->
                Logger.error "Error translating fields: #{reason}"
                pt_fields
              _ -> pt_fields
            end
          end)
      end)
      |> Task.await(12000)

      {:ok, translations}
    rescue
      e ->
        {:error, "Unhandled error while translating fields: #{inspect(e)}"}
    catch
      :exit, _ ->
        {:error, "Async task timeout while translating fields"}
    end
  end

  defp translate_pt_blocks(pt_blocks, target_lang, source_lang) do
    try do
      updated_fields = for {key, value} <- pt_blocks do
        text_array = get_text_from_blocks value

        # This sucks for overhead and # of req's, but it's the only way around
        # accidentally combining separate marks/sentences into one translation
        # TODO: Find way to bundle all text into one request
        translations = Task.async(fn ->
          text_array
          |> Enum.map(fn text ->
            body = construct_body [text], target_lang, source_lang
            Task.async(fn ->
              send_request body
            end)
          end)
          |> Enum.map(fn gcp_response -> Task.await gcp_response end)
          |> Enum.map(fn response ->
            case response do
              {:ok, translations} -> translations
              {:error, reason} ->
                Logger.error "Error translating block: #{inspect(reason)}"
                text_array
              _ -> text_array
            end
          end)
          |> List.flatten()
        end)
        |> Task.await(12000)

        updated_blocks = replace_text_in_children value, text_array, translations

        {key, updated_blocks}
      end

      {:ok, updated_fields}
    rescue
      e -> {:error, "Unhandled error while translating blocks: #{inspect(e)}"}
    catch
      :exit, _ -> {:error, "Async task timeout while translating blocks"}
    end
  end

  defp get_text_from_blocks(blocks) do
    blocks
    |> Enum.map(fn block ->
      # Handle 'children' being potentially nil
      if block["children"] == nil do
        []
      else
        block["children"]
        |> Enum.map(fn child ->
          child["text"]
        end)
      end
    end)
    |> List.flatten()
    |> Enum.reject(fn text -> text == nil end)
  end

  defp replace_text_in_children(blocks, original_text, translations) do
    blocks
    |> Enum.with_index()
    |> Enum.map(fn {block, _block_index} ->
      # Handle 'children' being potentially nil
      if block["children"] == nil do
        block
      else
        block["children"]
        |> Enum.with_index()
        # Map over each child, while keeping track of the index
        |> Enum.map(fn {child, _child_index} ->
          string_to_replace = child["text"]
          translated_replacement = translations |> Enum.at(Enum.find_index(original_text, fn text -> text == string_to_replace end))

          Map.put(child, "text", translated_replacement)
        end)
        # Replace the children array with the updated one
        |> fn updated_children -> Map.put(block, "children", updated_children) end.()
      end
    end)
  end
end

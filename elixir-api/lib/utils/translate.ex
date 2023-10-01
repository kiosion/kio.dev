defmodule Hexerei.Translate do
  @moduledoc """
  Util to handle all translation methods
  """

  use Hexerei.Cache.TranslateCache
  use Hexerei.Utils

  require Logger

  @gcloud_endpoint "https://translation.googleapis.com/language/translate/v2"

  defp req_url do
    @gcloud_endpoint <> "?key=" <> Hexerei.Env.get!(:gcloud_key)
  end

  defp send_request(body) do
    with {:ok, %HTTPoison.Response{status_code: 200, body: body}} <-
           Hexerei.Env.get(:http_client, Hexerei.HTTP.DefaultClient).post(
             req_url(),
             body,
             []
           ) do
      try do
        {:ok, parsed_body} = Poison.decode(body)
        {:ok, parsed_body["data"]["translations"] |> Enum.map(& &1["translatedText"])}
      rescue
        e ->
          Logger.error("Error parsing gcloud response: #{inspect(e)}")
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
    # Ensure that text_array is always a list
    text_array = if is_list(text_array), do: text_array, else: [text_array]

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

  def handle_translate(type, doc, lang_param) do
    case lang_param do
      "en" -> doc
      "fr" -> translate(type, doc, "fr", "en")
      _ -> {:error, "Invalid language"}
    end
    |> case do
      {:error, message} ->
        Logger.error("Error translating #{type}: #{inspect(message)}")
        doc

      res ->
        res
    end
  end

  def translate(type, sanity_response, target_lang, source_lang \\ "en") do
    Logger.info("Handling translation for #{type} to '#{target_lang}'")

    with key <- Hexerei.Env.get!(:gcloud_key),
         true <- key != nil do
      try do
        case type do
          :post -> translate_post(sanity_response, target_lang, source_lang)
          :posts -> translate_posts(sanity_response, target_lang, source_lang)
          :project -> translate_project(sanity_response, target_lang, source_lang)
          :projects -> translate_projects(sanity_response, target_lang, source_lang)
          :about -> translate_about(sanity_response, target_lang, source_lang)
          _ -> {:error, "Invalid type"}
        end
      rescue
        _ -> sanity_response
      end
    else
      _ ->
        Logger.error("No gcp key accessible for translation, skipping...")
        sanity_response
    end
  end

  defp translate_about(sanity_response, target_lang, source_lang) do
    with document <- sanity_response["result"],
         true <- document != nil do
      block_names = ["bio", "body", "contact", "now"]

      text_blocks = document |> Map.take(block_names)

      translated_blocks =
        case translate_pt_blocks(text_blocks, target_lang, source_lang) do
          {:ok, translated_blocks} ->
            translated_blocks

          {:error, reason} ->
            Logger.error("Error translating: #{reason}")
            text_blocks
        end

      %{
        "result" => document |> Map.merge(translated_blocks |> Enum.into(%{}))
      }
    else
      _ ->
        Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
        sanity_response
    end
  end

  defp translate_post(sanity_response, target_lang, source_lang, ignore_blocks \\ false) do
    with document <- sanity_response["result"],
         true <- document != nil do
      field_names = ["title", "desc"]
      block_names = ["body"]

      text_fields = Enum.map(field_names, &Map.get(document, &1))
      text_blocks = document |> Map.take(block_names)

      translated_fields =
        case translate_pt_fields(text_fields, target_lang, source_lang) do
          {:ok, translated_fields} ->
            translated_fields

          {:error, reason} ->
            Logger.error("Error translating: #{reason}")
            text_fields
        end

      # Since field translations will be in reverse order we can just pop them off
      updated_document =
        Enum.reduce(field_names, document, fn key, acc ->
          original_value = Map.get(acc, key)
          index = field_names |> Enum.find_index(fn k -> k == key end)
          translation = Enum.at(translated_fields, index)

          translation =
            case translation do
              [translation] -> translation
              translation when is_binary(translation) -> translation
              # Gracefully fall back to original value if translation is invalid
              _ -> original_value
            end

          Map.put(acc, key, translation)
        end)

      # For lists of posts we don't want to translate the blocks since they aren't visible anyways
      if ignore_blocks do
        %{
          "result" => updated_document
        }
      else
        translated_blocks =
          case translate_pt_blocks(text_blocks, target_lang, source_lang) do
            {:ok, translated_blocks} ->
              translated_blocks

            {:error, reason} ->
              Logger.error("Error translating: #{reason}")
              text_blocks
          end

        %{
          "result" => updated_document |> Map.merge(translated_blocks |> Enum.into(%{}))
        }
      end
    else
      _ ->
        Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
        sanity_response
    end
  end

  defp translate_posts(sanity_response, target_lang, source_lang) do
    documents = sanity_response["result"]

    updated_documents =
      Enum.map(documents, fn document ->
        translate_post(%{"result" => document}, target_lang, source_lang, true)["result"]
      end)

    %{
      "result" => updated_documents
    }
  end

  defp translate_project(sanity_response, target_lang, source_lang, ignore_blocks \\ false) do
    with document <- sanity_response["result"],
         true <- document != nil do
      field_names = ["title", "desc"]
      block_names = ["body"]

      text_fields = document |> Map.take(field_names) |> Map.values()
      text_blocks = document |> Map.take(block_names)

      translated_fields =
        case translate_pt_fields(text_fields, target_lang, source_lang) do
          {:ok, translated_fields} ->
            translated_fields

          {:error, reason} ->
            Logger.error("Error translating: #{reason}")
            text_fields
        end

      updated_document =
        Enum.reduce(field_names, document, fn key, acc ->
          index = field_names |> Enum.find_index(fn k -> k == key end)
          {_list, [translation]} = translated_fields |> List.pop_at(index)
          Map.put(acc, key, translation |> List.first())
        end)

      if ignore_blocks do
        %{
          "result" => updated_document
        }
      else
        translated_blocks =
          case translate_pt_blocks(text_blocks, target_lang, source_lang) do
            {:ok, translated_blocks} ->
              translated_blocks

            {:error, reason} ->
              Logger.error("Error translating: #{reason}")
              text_blocks
          end

        %{
          "result" => updated_document |> Map.merge(translated_blocks |> Enum.into(%{}))
        }
      end
    else
      _ ->
        Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
        sanity_response
    end
  end

  defp translate_projects(sanity_response, target_lang, source_lang) do
    documents = sanity_response["result"]

    updated_documents =
      Enum.map(documents, fn document ->
        translate_project(%{"result" => document}, target_lang, source_lang, true)["result"]
      end)

    %{
      "result" => updated_documents
    }
  end

  defp translate_pt_fields(pt_fields, target_lang, source_lang) do
    translations =
      pt_fields
      |> Task.async_stream(&translate_field(&1, target_lang, source_lang),
        max_concurrency: Enum.count(pt_fields)
      )
      |> Enum.map(fn
        {:ok, {:ok, result}} ->
          result

        {:ok, {:error, reason}} ->
          {:error, "Error translating fields: #{inspect(reason)}"}

        {:exit, reason} ->
          Logger.error("Error translating fields: #{inspect(reason)}")
          {:error, "Error translating fields"}
      end)

    {:ok, translations}
  end

  defp translate_pt_blocks(pt_blocks, target_lang, source_lang) do
    updated_fields =
      pt_blocks
      |> Enum.map(fn {key, value} ->
        text_array = get_text_from_blocks(value)

        translations =
          text_array
          |> Task.async_stream(&translate_field(&1, target_lang, source_lang),
            max_concurrency: Enum.count(text_array)
          )
          |> Enum.to_list()
          |> Enum.map(fn
            {:ok, {:ok, result}} ->
              result

            {:ok, {:error, _}} ->
              {:error, "Error translating block"}

            {:exit, reason} ->
              Logger.error("Error translating block: #{inspect(reason)}")
              {:error, "Error translating block"}
          end)

        updated_blocks = replace_text_in_children(value, text_array, translations)

        {key, updated_blocks}
      end)

    {:ok, updated_fields |> Enum.into(%{})}
  end

  defp translate_field(text, target_lang, source_lang) do
    if text == "" or text == nil do
      {:ok, text}
    else
      with cache_res <-
             TranslateCache.get(text <> "_" <> target_lang <> "_" <> source_lang),
           true <- cache_res != nil do
        {:ok, cache_res}
      else
        _ ->
          res = construct_body(text, target_lang, source_lang) |> send_request

          case res do
            {:ok, translation} ->
              TranslateCache.put(
                text <> "_" <> target_lang <> "_" <> source_lang,
                translation
              )

              res

            _ ->
              res
          end
      end
    end
  end

  defp get_text_from_blocks(blocks) do
    blocks
    |> Enum.flat_map(fn block ->
      case block do
        %{"children" => children} -> children
        _ -> []
      end
    end)
    |> Enum.map(fn child ->
      if "notranslate" in Map.get(child, "marks", []), do: nil, else: Map.get(child, "text")
    end)
    |> Enum.reject(&is_nil/1)
  end

  defp replace_text_in_children(blocks, original_text, translations) do
    # Build a map from original_text to translations for quick lookup
    translation_map = original_text |> Enum.zip(translations) |> Map.new()

    Enum.map(blocks, fn block ->
      case Map.fetch(block, "children") do
        {:ok, children} ->
          updated_children =
            Enum.map(children, fn child ->
              case child do
                # Check if the child is a text node and it's not marked w/ "notranslate"
                %{"text" => text, "marks" => marks} when text != nil ->
                  if Enum.member?(marks || [], "notranslate") or Enum.member?(marks || [], "code") do
                    child
                  else
                    translated =
                      case translation_map[text] do
                        # Unwrap single-item list
                        [single_translation] -> single_translation
                        _ -> text
                      end

                    Map.put(child, "text", translated)
                  end

                _ ->
                  child
              end
            end)

          Map.put(block, "children", updated_children)

        :error ->
          block
      end
    end)
  end
end

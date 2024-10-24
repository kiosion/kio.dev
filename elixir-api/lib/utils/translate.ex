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
      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        # try to parse the body to get the error message
        parsed_body =
          try do
            {:ok, parsed_body} = Poison.decode(body)
            parsed_body
          rescue
            _ ->
              %{error: %{message: "Unknown error sending request"}}
          end

        Logger.error(
          "Error sending request - #{status_code} - #{inspect(parsed_body["error"]["message"])}"
        )

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
        {"format", "text"},
        {"key", Hexerei.Env.get!(:gcloud_key)}
      ]
    }
  end

  @spec handle_translate(
          type :: :post | :posts | :project | :projects | :about | :config,
          doc :: map(),
          lang_param :: String.t()
        ) :: {:ok, map()} | {:error, map(), list(map())}
  def handle_translate(type, doc, lang_param) do
    case lang_param do
      "en" -> {:ok, doc}
      "fr" -> translate(type, doc, "fr", "en")
      _ -> {:error, doc, [%{message: "Invalid language param"}]}
    end
    |> case do
      {:error, _doc, message} ->
        Logger.error("Error translating #{type}: #{inspect(message)}")
        {:error, doc, [%{message: "Error translating #{type}", detail: message}]}

      res ->
        res
    end
  end

  @spec translate(
          type :: :post | :posts | :project | :projects | :about | :config,
          sanity_response :: map(),
          target_lang :: String.t(),
          source_lang :: String.t()
        ) :: {:ok, map()} | {:error, map(), list(map())}
  @spec translate(
          type :: :post | :posts | :project | :projects | :about | :config,
          sanity_response :: map(),
          target_lang :: String.t()
        ) :: {:ok, map()} | {:error, map(), list(map())}
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
          :config -> translate_config(sanity_response, target_lang, source_lang)
          _ -> {:error, sanity_response, [%{message: "Invalid type"}]}
        end
      rescue
        e ->
          Logger.error("Error translating #{type}: #{inspect(e)}")
          {:error, sanity_response, [%{message: "Error translating #{type}", detail: e}]}
      end
    else
      _ ->
        error = "No gcp key accessible for translation, skipping..."
        Logger.error(error)
        {:error, sanity_response, [%{message: error}]}
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

          {:error, errors} ->
            Logger.error("Error translating: #{inspect(errors)}")
            text_blocks
        end

      {:ok,
       %{
         "result" => document |> Map.merge(translated_blocks |> Enum.into(%{}))
       }}
    else
      _ ->
        Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
        {:error, sanity_response, [%{message: "Cannot translate, invalid document"}]}
    end
  end

  # TODO: Refactor to pattern-match err cases for better readability
  # defp translate_config(%{ "result" => nil }, _target_lang, _source_lang) do
  #   Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
  #   {:error, sanity_response, [%{message: "Cannot translate, invalid document"}]}
  # end

  defp translate_config(sanity_response, target_lang, source_lang) do
    with document <- sanity_response["result"],
         true <- document != nil do
      field_names = ["bio"]
      content_arrays = ["about", "meta"]

      # for each field name, fetch value from document, translate, and add to map by original field name
      translated_fields =
        Enum.reduce(field_names, %{}, fn key, acc ->
          case Map.get(document, key) do
            value when is_binary(value) ->
              translated_field =
                case translate_pt_fields([value], target_lang, source_lang) do
                  {:ok, translated_fields} ->
                    {:ok, translated_fields}

                  {:error, errors} ->
                    Logger.error("Error(s) translating: #{inspect(errors)}")
                    # value
                    {:error, errors}
                end

              Map.put(acc, key, translated_field)

            value ->
              Logger.warning("Cannot translate invalid field: #{inspect(value)}")
          end
        end)

      translated_content_arrays =
        Enum.map(content_arrays, fn name ->
          case translate_content_list(Map.get(document, name), target_lang, source_lang) do
            {:ok, translated_content} -> translated_content
            {:error, errors} -> {:error, errors}
          end
        end)

      collected_errors =
        Enum.flat_map(translated_content_arrays, fn
          {:error, errors} -> errors
          _ -> []
        end)
        |> Enum.concat(
          Enum.flat_map(translated_fields, fn
            {_key, {:error, errors}} -> errors
            _ -> []
          end)
        )

      if not Enum.empty?(collected_errors) do
        {:error, sanity_response, collected_errors}
      else
        translated_blocks =
          Enum.reduce(content_arrays, %{}, fn key, acc ->
            idx = content_arrays |> Enum.find_index(fn k -> k == key end)
            Map.put(acc, key, Enum.at(translated_content_arrays, idx))
          end)
          |> (fn acc ->
                Enum.reduce(translated_fields, acc, fn {k, v}, acc ->
                  case v do
                    {:ok, [translation]} -> Map.put(acc, k, translation)
                    _ -> Map.put(acc, k, Map.get(document, k))
                  end
                end)
              end).()

        {:ok,
         %{
           "result" => document |> Map.merge(translated_blocks |> Enum.into(%{}))
         }}
      end
    else
      _ ->
        Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
        {:error, sanity_response, [%{message: "Cannot translate, invalid document"}]}
    end
  end

  defp translate_content_list(content_list, target_lang, source_lang) do
    updated_list =
      Enum.map(content_list, fn content ->
        field_names = ["title"]
        block_names = ["content"]

        fields = Enum.map(field_names, &Map.get(content, &1))
        blocks = Map.take(content, block_names)

        translated_title =
          case translate_pt_fields(fields, target_lang, source_lang) do
            {:ok, translated_fields} ->
              translated_fields |> List.first()

            {:error, errors} ->
              Logger.error("Error translating: #{inspect(errors |> List.first())}")
              content["title"]
          end

        translated_content =
          case translate_pt_blocks(blocks, target_lang, source_lang) do
            {:ok, translated_blocks} ->
              translated_blocks["content"]

            {:error, errors} ->
              Logger.error(
                "Error(s) translating config_content_list blocks: #{inspect(errors |> List.first())}"
              )

              {:error, errors}
          end

        case translated_content do
          {:error, errors} ->
            %{"title" => translated_title, "content" => content["content"], "errors" => errors}

          _ ->
            %{"title" => translated_title, "content" => translated_content, "errors" => []}
        end
      end)

    all_errors = Enum.flat_map(updated_list, fn content -> content["errors"] end)

    if Enum.empty?(all_errors) do
      {:ok, updated_list |> Enum.map(fn content -> Map.delete(content, "errors") end)}
    else
      {:error, all_errors}
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

          {:error, errors} ->
            {:error, errors}
        end

      case translated_fields do
        {:error, errors} ->
          {:error, sanity_response, errors}

        _ ->
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
            {:ok,
             %{
               "result" => updated_document
             }}
          else
            translated_blocks =
              case translate_pt_blocks(text_blocks, target_lang, source_lang) do
                {:ok, translated_blocks} ->
                  translated_blocks

                {:error, errors} ->
                  Logger.error("Error(s) translating post blocks: #{inspect(errors)}")
                  text_blocks
              end

            {:ok,
             %{
               "result" => updated_document |> Map.merge(translated_blocks |> Enum.into(%{}))
             }}
          end
      end
    else
      _ ->
        Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
        {:error, sanity_response, [%{message: "Cannot translate, invalid document"}]}
    end
  end

  defp translate_posts(sanity_response, target_lang, source_lang) do
    documents = sanity_response["result"]

    updated_docs_with_errors =
      Enum.map(documents, fn document ->
        case translate_post(%{"result" => document}, target_lang, source_lang, true) do
          {:ok, translated_doc} ->
            {:ok, translated_doc["result"], []}

          {:error, _doc, errors} ->
            {:error, document, errors}
        end
      end)

    {successful, failed} =
      Enum.split_with(updated_docs_with_errors, fn
        {:ok, _doc, _errors} -> true
        {:error, _doc, _errors} -> false
      end)

    translated_results = Enum.map(successful, fn {:ok, doc, _errors} -> doc end)
    failed_results = Enum.map(failed, fn {:error, doc, _errors} -> doc end)

    errors = Enum.flat_map(failed, fn {:error, _doc, errors} -> errors end)

    if Enum.empty?(errors) do
      {:ok, %{"result" => translated_results}}
    else
      {:error, %{"result" => translated_results ++ failed_results}, errors}
    end
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

          {:error, errors} ->
            {:error, errors}
        end

      case translated_fields do
        {:error, errors} ->
          {:error, sanity_response, errors}

        _ ->
          updated_document =
            Enum.reduce(field_names, document, fn key, acc ->
              index = field_names |> Enum.find_index(fn k -> k == key end)
              {_list, [translation]} = translated_fields |> List.pop_at(index)
              Map.put(acc, key, translation |> List.first())
            end)

          if ignore_blocks do
            {:ok,
             %{
               "result" => updated_document
             }}
          else
            translated_blocks =
              case translate_pt_blocks(text_blocks, target_lang, source_lang) do
                {:ok, translated_blocks} ->
                  translated_blocks

                {:error, errors} ->
                  Logger.error("Error(s) translating project blocks: #{inspect(errors)}")
                  text_blocks
              end

            {:ok,
             %{
               "result" => updated_document |> Map.merge(translated_blocks |> Enum.into(%{}))
             }}
          end
      end
    else
      _ ->
        Logger.error("Cannot translate invalid document: #{inspect(sanity_response)}")
        {:error, sanity_response, [%{message: "Cannot translate, invalid document"}]}
    end
  end

  defp translate_projects(sanity_response, target_lang, source_lang) do
    documents = sanity_response["result"]

    updated_docs_with_errors =
      Enum.map(documents, fn document ->
        case translate_project(%{"result" => document}, target_lang, source_lang, true) do
          {:ok, translated_doc} ->
            {:ok, translated_doc["result"], []}

          {:error, _doc, errors} ->
            {:error, document, errors}
        end
      end)

    {successful, failed} =
      Enum.split_with(updated_docs_with_errors, fn
        {:ok, _doc, _errors} -> true
        {:error, _doc, _errors} -> false
      end)

    translated_results = Enum.map(successful, fn {:ok, doc, _errors} -> doc end)
    failed_results = Enum.map(failed, fn {:error, doc, _errors} -> doc end)

    errors = Enum.flat_map(failed, fn {:error, _doc, errors} -> errors end)

    if Enum.empty?(errors) do
      {:ok, %{"result" => translated_results}}
    else
      {:error, %{"result" => translated_results ++ failed_results}, errors}
    end
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
          Logger.error("Error translating fields: #{inspect(reason)}")
          {:error, reason}

        {:exit, reason} ->
          Logger.error("Error translating fields: #{inspect(reason)}")
          {:error, "Error translating fields"}
      end)

    collected_errors =
      Enum.flat_map(translations, fn
        {:error, reason} -> [reason]
        _ -> []
      end)

    if not Enum.empty?(collected_errors) do
      {:error, collected_errors}
    else
      {:ok, translations}
    end
  end

  defp translate_pt_blocks(pt_blocks, target_lang, source_lang) do
    # TODO: Refactor to collect errors here & at replace_text_in_children level and return as single list
    updated_fields =
      pt_blocks
      |> Enum.map(fn {key, value} ->
        case value do
          nil ->
            {key, nil, []}

          _ ->
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

                {:ok, {:error, reason}} ->
                  {:error, "Error translating block: #{inspect(reason)}"}

                {:exit, reason} ->
                  Logger.error("Error translating block: #{inspect(reason)}")
                  {:error, "Error translating block"}
              end)

            collected_errors =
              Enum.flat_map(translations, fn
                {:error, reason} -> [reason]
                _ -> []
              end)

            updated_blocks = replace_text_in_children(value, text_array, translations)

            {key, updated_blocks, collected_errors}
        end
      end)

    all_errors = Enum.flat_map(updated_fields, fn {_, _, errors} -> errors end)

    if Enum.empty?(all_errors) do
      {:ok, Enum.map(updated_fields, fn {key, value, _} -> {key, value} end) |> Enum.into(%{})}
    else
      {:error, all_errors}
    end
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

  defp replace_text_in_children(blocks, original_texts, translations) do
    # Build a list of text entries with their whitespace
    texts_with_ws =
      original_texts
      |> Enum.map(fn text ->
        {leading_ws, trimmed_text, trailing_ws} = extract_whitespace(text)

        %{
          original_text: text,
          trimmed_text: trimmed_text,
          leading_ws: leading_ws,
          trailing_ws: trailing_ws
        }
      end)

    # Re-attach whitespace to translations
    translations_with_ws =
      texts_with_ws
      |> Enum.zip(translations)
      |> Enum.map(fn {text_info, translation} ->
        # Unwrap single-item list
        translation_string =
          case translation do
            [single_translation] -> single_translation
            translation when is_binary(translation) -> translation
            _ -> ""
          end

        new_text = text_info.leading_ws <> translation_string <> text_info.trailing_ws
        {text_info.original_text, new_text}
      end)

    replace_text_in_blocks(blocks, Map.new(translations_with_ws))
  end

  defp replace_text_in_blocks(blocks, translation_map) do
    Enum.map(blocks, fn block ->
      update_block(block, translation_map)
    end)
  end

  defp update_block(%{"children" => children} = block, translation_map) do
    updated_children =
      Enum.map(children, fn child ->
        update_child(child, translation_map)
      end)

    Map.put(block, "children", updated_children)
  end

  defp update_block(block, _translation_map), do: block

  defp update_child(%{"text" => text, "marks" => marks} = child, translation_map)
       when is_binary(text) do
    marks_list = marks || []

    if Enum.any?(marks_list, &(&1 == "notranslate" or &1 == "code")) do
      child
    else
      Map.put(child, "text", Map.get(translation_map, text, text))
    end
  end

  defp update_child(child, _translation_map), do: child

  defp extract_whitespace(text) when is_binary(text) do
    trimmed_text = String.trim(text)
    leading_ws_length = String.length(text) - String.length(String.trim_leading(text))
    trailing_ws_length = String.length(text) - String.length(String.trim_trailing(text))
    leading_ws = String.slice(text, 0, leading_ws_length) || ""
    trailing_ws = String.slice(text, -trailing_ws_length, trailing_ws_length) || ""
    {leading_ws, trimmed_text, trailing_ws}
  end

  defp extract_whitespace(_), do: {"", "", ""}

  # defp replace_text_in_children(blocks, original_text, translations) do
  #   # Build a map from original_text to translations for quick lookup
  #   translation_map = original_text |> Enum.zip(translations) |> Map.new()

  #   Enum.map(blocks, fn block ->
  #     case Map.fetch(block, "children") do
  #       {:ok, children} ->
  #         updated_children =
  #           Enum.map(children, fn child ->
  #             case child do
  #               # Check if the child is a text node and it's not marked w/ "notranslate"
  #               %{"text" => text, "marks" => marks} when text != nil ->
  #                 if Enum.member?(marks || [], "notranslate") or Enum.member?(marks || [], "code") do
  #                   child
  #                 else
  #                   translated =
  #                     case translation_map[text] do
  #                       # Unwrap single-item list
  #                       [single_translation] -> single_translation
  #                       _ -> text
  #                     end

  #                   Map.put(child, "text", translated)
  #                 end

  #               _ ->
  #                 child
  #             end
  #           end)

  #         Map.put(block, "children", updated_children)

  #       :error ->
  #         block
  #     end
  #   end)
  # end
end

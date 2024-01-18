defmodule Hexerei.Utils do
  @moduledoc """
  Generic utility funcs
  """

  use Hexerei.Response

  alias Hexerei.SanityClient.Utils, as: SanityUtils
  alias Hexerei.PT, as: PT
  alias Hexerei.Translate, as: Translate

  require Logger

  defmacro __using__(_opts) do
    quote do
      import Hexerei.Utils
    end
  end

  @spec update_meta(
          map :: map(),
          meta :: map(),
          duration :: integer()
        ) :: map()
  def update_meta(map, meta, duration) do
    map
    |> Map.delete("query")
    |> Map.put("meta", meta)
    |> Map.update("ms", duration, &(&1 + (duration - &1)))
  end

  @spec transform_result_document(
          query :: String.t(),
          result :: map(),
          type :: :post | :posts | :project | :projects | :config | :tag | :tags,
          params :: map(),
          additional_meta :: map() | nil
        ) :: {{map(), list()}, map(), integer()}
  def transform_result_document(query, result, type, params, additional_meta \\ nil) do
    case result["result"] do
      nil ->
        {meta, code} =
          cond do
            type == :post or type == :project ->
              {
                %{
                  "total" => 0,
                  "count" => 0,
                  "id" => nil
                },
                404
              }

            type == :posts or type == :posts or type == :tags ->
              {%{
                 "total" => 0,
                 "count" => 0,
                 "sort" => params["s"],
                 "order" => params["o"]
               }, 200}

            true ->
              {%{
                 "total" => 0,
                 "count" => 0
               }, 404}
          end

        {result, meta, code, []}

      _ ->
        {meta, code, meta_errors} =
          cond do
            type == :post or type == :project ->
              SanityUtils.try_increment_view_count(query)

              errors =
                receive do
                  {:increment_view_count_done, result} ->
                    case result do
                      {:ok} ->
                        []

                      {:error, error} ->
                        [error]
                    end
                end

              {
                %{
                  "total" => 1,
                  "count" => 1,
                  "id" => params["id"]
                },
                200,
                errors
              }

            type == :posts or type == :posts ->
              {
                %{
                  "sort" => params["s"],
                  "order" => params["o"]
                },
                200,
                []
              }

            true ->
              {
                %{
                  "total" => 1,
                  "count" => 1,
                  "sort" => params["s"],
                  "order" => params["o"]
                },
                200,
                []
              }
          end

        meta =
          if is_map(additional_meta), do: Map.merge(meta, additional_meta), else: meta

        {translated_result, translate_errors} =
          if type != :tag and type != :tags do
            case Translate.handle_translate(type, result, params["lang"]) do
              {:error, res, errors} ->
                {res, [errors | meta_errors]}

              {:ok, res} ->
                {res, meta_errors}
            end
          else
            {result, meta_errors}
          end

        cond do
          (meta["count"] > 0 and type == :post) or type == :project ->
            {headings, heading_errors} =
              case PT.build_summary(translated_result["result"]["body"]) do
                {:error, headings, errors} ->
                  {headings, errors}

                {:ok, headings} ->
                  {headings, []}
              end

            if Enum.empty?(headings) do
              {translated_result, [translate_errors | heading_errors]}
            else
              {
                Kernel.put_in(
                  translated_result,
                  ["result", "headings"],
                  headings
                ),
                [translate_errors | heading_errors]
              }
            end

          true ->
            {translated_result, translate_errors}
        end
        |> (fn {data, errors} -> {{data, errors}, meta, code} end).()
    end
  end

  @spec update_meta_and_send_response(
          conn :: Plug.Conn.t(),
          code :: integer(),
          {data :: map(), errors :: list()},
          meta :: map(),
          duration :: integer()
        ) :: Plug.Conn.t()
  def update_meta_and_send_response(conn, code, {data, errors}, meta, duration) do
    res_errors = errors |> List.flatten() |> Enum.uniq()

    data
    |> update_meta(meta, duration)
    |> (fn data -> conn |> json_res(code, %{code: code, data: data, errors: res_errors}) end).()
  end

  def validate_query_params(params, expected) do
    Enum.reduce(expected, %{}, fn {key, default}, acc ->
      if Map.has_key?(params, key) do
        if is_boolean(default) and is_binary(params[key]) do
          Map.put(acc, key, params[key] == "true")
        else
          Map.put(acc, key, params[key])
        end
      else
        Map.put(acc, key, default)
      end
    end)
  end

  def params_to_integer(params, keys \\ [:limit, :skip]) do
    keys = Enum.map(keys, &to_string/1)

    Enum.reduce(params, %{}, fn {key, value}, acc ->
      if key in keys do
        if value != nil and not is_integer(value) do
          Map.put(acc, key, String.to_integer(value))
        else
          Map.put(acc, key, value)
        end
      else
        Map.put(acc, key, value)
      end
    end)
  end

  def empty_to_nil(params, keys \\ [:date]) do
    keys = Enum.map(keys, &to_string/1)

    Enum.reduce(params, %{}, fn {key, value}, acc ->
      if key in keys do
        if value == "" do
          Map.put(acc, key, nil)
        else
          Map.put(acc, key, value)
        end
      else
        Map.put(acc, key, value)
      end
    end)
  end
end

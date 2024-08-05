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
  @spec transform_result_document(
          query :: String.t(),
          result :: map(),
          type :: :post | :posts | :project | :projects | :config | :tag | :tags,
          params :: map()
        ) :: {{map(), list()}, map(), integer()}
  def transform_result_document(query, result, type, params, additional_meta \\ nil) do
    case result["result"] do
      nil ->
        {meta, code, errs} =
          cond do
            type == :post or type == :project ->
              {
                %{
                  "total" => 0,
                  "count" => 0,
                  "id" => nil
                },
                404,
                [%{message: "No result found"}]
              }

            type == :posts or type == :posts or type == :tags ->
              {%{
                 "total" => 0,
                 "count" => 0,
                 "sort" => params["s"],
                 "order" => params["o"]
               }, 200, []}

            true ->
              {%{
                 "total" => 0,
                 "count" => 0
               }, 404,
               [
                 %{message: "No result found"}
               ]}
          end

        {{result, errs}, meta, code}

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
                after
                  2500 ->
                    [%{message: "View increment timed out"}]
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

          (meta["count"] > 0 and type == :posts) or type == :projects ->
            # for each post/project, build a summary
            {headings_by_item, heading_errors} =
              Enum.reduce(
                translated_result["result"],
                {%{}, []},
                fn item, {acc, errors} ->
                  case PT.build_summary(item["body"]) do
                    {:error, headings, err} ->
                      {Map.put(acc, item["_id"], headings), [err | errors]}

                    {:ok, headings} ->
                      {Map.put(acc, item["_id"], headings), errors}
                  end
                end
              )

            if Map.keys(headings_by_item) |> Enum.empty?() do
              {translated_result, [translate_errors | heading_errors]}
            else
              {
                Kernel.put_in(
                  translated_result,
                  ["result"],
                  translated_result["result"]
                  |> Enum.map(fn item ->
                    Kernel.put_in(
                      item,
                      ["headings"],
                      Map.get(headings_by_item, item["_id"])
                    )
                  end)
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

  @spec validate_query_params(Plug.Conn.t(), map()) :: {:ok, map()} | {:error, String.t()}
  @spec validate_query_params(Plug.Conn.t(), map(), map()) :: {:ok, map()} | {:error, String.t()}
  def validate_query_params(conn, additional_params, expected) do
    try do
      params = Map.merge(Plug.Conn.fetch_query_params(conn).query_params, additional_params)

      {:ok, validate_params(params, expected)}
    rescue
      e ->
        {:error, e}
    end
  end

  def validate_query_params(conn, expected) do
    try do
      params = Plug.Conn.fetch_query_params(conn).query_params

      {:ok, validate_params(params, expected)}
    rescue
      e ->
        {:error, e}
    end
  end

  defp validate_params(params, expected) do
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

  @spec params_to_integer({:ok, map()}) :: {:ok, map()}
  @spec params_to_integer({:ok, map()}, list()) :: {:ok, map()}
  @spec params_to_integer({:error, String.t()}) :: {:error, String.t()}
  @spec params_to_integer({:error, String.t()}, list()) :: {:error, String.t()}
  def params_to_integer(params, keys \\ [:limit, :skip])

  def params_to_integer({:ok, params}, keys) do
    keys = Enum.map(keys, &to_string/1)

    {:ok,
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
     end)}
  end

  def params_to_integer({:error, reason}, _keys), do: {:error, reason}

  @spec empty_to_nil({:ok, map()}) :: {:ok, map()}
  @spec empty_to_nil({:ok, map()}, list()) :: {:ok, map()}
  @spec empty_to_nil({:error, String.t()}) :: {:error, String.t()}
  @spec empty_to_nil({:error, String.t()}, list()) :: {:error, String.t()}
  def empty_to_nil(params, keys \\ [:date])

  def empty_to_nil({:ok, params}, keys) do
    keys = Enum.map(keys, &to_string/1)

    {:ok,
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
     end)}
  end

  def empty_to_nil({:error, reason}, _keys), do: {:error, reason}
end

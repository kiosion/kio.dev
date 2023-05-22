defmodule Hexerei.SanityClient.Utils do
  use Hexerei.Response
  use Hexerei.Utils
  use Hexerei.Cache.QueryCache

  alias Hexerei.SanityClient, as: Sanity

  require Logger

  defmacro __using__ _opts do
    quote do
      import Hexerei.SanityClient.Utils
    end
  end

  def handle_sanity_fetch conn, query, cb, init_duration \\ nil do
    start = System.system_time :millisecond

    with result <- QueryCache.get("#{query}"),
         true   <- result != nil
    do
      with {:arity, 3} <- :erlang.fun_info(cb, :arity) do
        cb.(conn, Poison.decode!(result), init_duration || 0)
      else
        _ -> cb.(conn, Poison.decode!(result))
      end
    else
      _ ->
      with {:ok, result} <- Sanity.fetch query do
        decoded = Poison.decode!(result)

        if decoded["result"] != nil do
          # 30m cache
          QueryCache.put "#{query}", result, 30 * 60
        end

        duration = case init_duration do
          nil -> System.system_time(:millisecond) - start
          _ -> System.system_time(:millisecond) - start + init_duration
        end

        case :erlang.fun_info(cb, :arity) do
          {:arity, 3} -> cb.(conn, decoded, duration)
          _ -> cb.(conn, decoded)
        end
      else
        {:error, error} ->
          Logger.error("Sanity fetch failed: #{inspect error}")
          conn |> generic_error(error.message)
      end
    end
  end

  def limit_query(query, params) do
    case params["limit"] > 0 do
      true -> query <> " | order(#{params["s"]} #{params["o"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"
      false -> query <> " | order(#{params["s"]} #{params["o"]})"
    end
  end

  def document_counts_query(query), do: "{ 'total': count(#{query}) }"
  def document_counts_query(query, limited_query), do: "{ 'total': count(#{query})#{if limited_query do ", 'count': count(#{limited_query})" else "" end}}"
end

defmodule Hexerei.SanityClient.Utils do
  use Hexerei.Response
  use Hexerei.Utils

  alias Hexerei.SanityClient, as: Sanity

  defmacro __using__(_opts) do
    quote do
      import Hexerei.SanityClient.Utils
    end
  end

  def handle_sanity_fetch(conn, query, cb, init_duration \\ nil) do
    start = System.system_time(:millisecond)
    with {:ok, result} <- Sanity.fetch(query) do
      duration = case init_duration do
        nil -> System.system_time(:millisecond) - start
        _ -> System.system_time(:millisecond) - start + init_duration
      end
      case :erlang.fun_info(cb, :arity) do
        {:arity, 3} -> cb.(conn, Poison.decode!(result), duration)
        _ -> cb.(conn, Poison.decode!(result))
      end
    else
      {:error, error} ->
        Logger.error("Sanity fetch failed: #{inspect error}")
        conn |> generic_error(error.message)
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

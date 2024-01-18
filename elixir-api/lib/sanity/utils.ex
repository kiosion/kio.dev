defmodule Hexerei.SanityClient.Utils do
  use Hexerei.Response
  use Hexerei.Utils
  use Hexerei.Cache.QueryCache

  alias Hexerei.SanityClient, as: Sanity

  require Logger

  defmacro __using__(_opts) do
    quote do
      import Hexerei.SanityClient.Utils
    end
  end

  @spec handle_sanity_fetch(
          conn :: Plug.Conn.t(),
          query :: String.t(),
          cb :: (Plug.Conn.t(), map() -> Plug.Conn.t()),
          init_duration :: integer() | nil
        ) :: Plug.Conn.t()
  @spec handle_sanity_fetch(
          conn :: Plug.Conn.t(),
          query :: String.t(),
          cb :: (Plug.Conn.t(), map(), integer() -> Plug.Conn.t()),
          init_duration :: integer() | nil
        ) :: Plug.Conn.t()
  def handle_sanity_fetch(conn, query, cb, init_duration \\ nil) do
    start = System.system_time(:millisecond)

    with true <- String.contains?(query, "path('drafts.**')"),
         result <- QueryCache.get("#{query}"),
         true <- result != nil do
      case :erlang.fun_info(cb, :arity) do
        {:arity, 3} -> cb.(conn, Poison.decode!(result), init_duration || 0)
        _ -> cb.(conn, Poison.decode!(result))
      end
    else
      _ ->
        with {:ok, result} <- Sanity.fetch(query) do
          decoded = Poison.decode!(result)

          if decoded["result"] != nil and String.contains?(query, "path('drafts.**')") == true do
            # 30m cache
            QueryCache.put("#{query}", result, 30 * 60)
          end

          duration =
            case init_duration do
              nil -> System.system_time(:millisecond) - start
              _ -> System.system_time(:millisecond) - start + init_duration
            end

          case :erlang.fun_info(cb, :arity) do
            {:arity, 3} -> cb.(conn, decoded, duration)
            _ -> cb.(conn, decoded)
          end
        else
          {:error, error} ->
            Logger.error("Sanity fetch failed: #{inspect(error)}")
            conn |> generic_error(error.message)
        end
    end
  end

  @spec try_increment_view_count(
          query :: String.t(),
          caller :: pid()
        ) :: {:ok, pid()}
  def try_increment_view_count(query, caller \\ self()),
    do:
      Task.start(fn ->
        result =
          case Sanity.patch(query, %{"inc" => %{"views" => 1}}) do
            {:ok, _response} ->
              {:ok}

            {:error, error} ->
              Logger.error("Failed to increment view count: #{inspect(error)}")
              {:error, %{message: "Failed to increment view count", detail: error}}
          end

        send(caller, {:increment_view_count_done, result})
        # TODO: This should REALLY be refactored but I don't have energy right now.
        # This hack is to ensure the message is in the mailbox during testing since it's consumed upon `receive`.
        send(caller, {:increment_view_count_done, result})
      end)

  @spec limit_query(String.t(), map()) :: String.t()
  def limit_query(query, params) do
    if params["limit"] > 0 do
      query <>
        " | order(#{params["s"]} #{params["o"]}) [#{params["skip"]}...#{params["skip"] + params["limit"]}]"
    else
      query <> " | order(#{params["s"]} #{params["o"]})"
    end
  end

  @spec document_counts_query(String.t()) :: String.t()
  @spec document_counts_query(String.t(), String.t()) :: String.t()
  def document_counts_query(query), do: "{ 'total': count(#{query}) }"

  def document_counts_query(query, limited_query),
    do:
      "{ 'total': count(#{query})#{if limited_query do
        ", 'count': count(#{limited_query})"
      else
        ""
      end}}"
end

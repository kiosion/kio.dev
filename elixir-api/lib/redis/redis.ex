defmodule Hexerei.RedisCache do
  use GenServer

  alias Redix

  require Logger

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts)
  end

  @impl true
  def init(opts) do
    Logger.info("Connecting to Redis")

    try do
      {:ok, _conn} = Redix.start_link(opts, name: :redis_cache)
      Logger.info("Connected to Redis")
      {:ok, :ok}
    rescue
      e ->
        Logger.error("Failed to connect to Redis: #{inspect(e)}")
        {:error, e}
    end
  end

  @doc """
  Check if a given key exists in the Redis cache
  """
  def exists(key) do
    case Redix.command(:redis_cache, ["EXISTS", key]) do
      {:ok, 1} -> true
      {:ok, 0} -> false
      _ -> false
    end
  end

  @doc """
  Get a value from the Redis cache
  """
  def get(key, opts \\ []) do
    prefix = Keyword.get(opts, :prefix, nil)

    key =
      if prefix != nil do
        "#{prefix}:#{key}"
      else
        key
      end

    case Redix.command(:redis_cache, ["GET", key]) do
      {:ok, value} when value != nil ->
        Logger.info("Cache hit for #{inspect(key)}: #{inspect(value)}")
        :erlang.binary_to_term(value)

      _ ->
        nil
    end
  end

  @doc """
  Set a value in the Redis cache, default TTL is 5 minutes
  """
  def set(key, value, opts \\ []) do
    ttl = Keyword.get(opts, :ttl, 5 * 60)
    prefix = Keyword.get(opts, :prefix, nil)

    key =
      case prefix do
        nil -> key
        _ -> "#{prefix}:#{key}"
      end

    with true <- value != nil,
         {:ok, "OK"} <- Redix.command(:redis_cache, ["SET", key, :erlang.term_to_binary(value)]),
         {:ok, "OK"} <- Redix.command(:redis_cache, ["EXPIRE", key, ttl]) do
      true
    else
      false ->
        Logger.error("Failed to set cache with a value of nil")
        false

      _ ->
        false
    end
  end
end

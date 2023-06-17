defmodule Hexerei.CDNCache do
  use Hexerei.Cache.Base, table_name: :cdn_cache

  defmacro __using__(_opts) do
    quote do
      alias Hexerei.CDNCache, as: CDNCache
    end
  end

  #   use Supervisor
  #   require Logger

  #   defmacro __using__(_opts) do
  #     quote do
  #       alias Hexerei.CDNCache, as: CDNCache
  #     end
  #   end

  #   def start_link(opts \\ []) do
  #     GenServer.start_link(__MODULE__, opts)
  #   end

  #   def init(opts) do
  #     max_size = Keyword.get(opts, :options, [max_size: 200])[:max_size]

  #     Logger.info "Creating CDN cache with max_size of #{max_size}"

  #     table = :ets.new(:cdn_cache, [
  #       # gives key=> value semantics
  #       :set,

  #       # allows any process to read/write to the table
  #       :public,

  #       # allow ETS table to access by its name, ':cdn_cache'
  #       :named_table,

  #       # favor read-locks over write-locks
  #       read_concurrency: true,

  #       # internally split the ETS table into buckets in order
  #       # to reduce write-lock contention
  #       write_concurrency: true,
  #     ])

  #     # Store the max_size in the ETS table as a regular entry, but with a nil key
  #     # for expires_at - since nil is always greater than any integer
  #     :ets.insert(:cdn_cache, {:__max_size, max_size, nil})

  #     {:ok, []}
  #   end

  #   def get(key) do
  #     entry = :ets.lookup(:cdn_cache, key)
  #     with [{_key, value, expires_at}] <- entry,
  #          true <- :erlang.system_time(:second) > expires_at
  #     do
  #       value
  #     else
  #       [] -> nil # key not found in ets
  #       false ->
  #         # key found but expired
  #         :ets.delete(:cdn_cache, key)
  #         nil
  #     end
  #   end

  #   # default 'put', with ttl of 2 hours
  #   def put(key, value) do
  #     put(key, value, 2 * 60 * 60)
  #   end

  #   def put(key, value, ttl) do
  #     expires_at = :erlang.system_time(:second) + ttl
  #     entry = {key, value, expires_at}

  #     # Only purge if we're inserting a new value AND
  #     # we've reached our size limit
  #     # (If we're updating a value, then our size won't increase)
  #     if !exists?(key) && :ets.info(:cdn_cache, :size) > get_max_size() do
  #       purge()
  #     end

  #     :ets.insert(:cdn_cache, entry)
  #   end

  #   def exists?(key) do
  #     :ets.member(:cdn_cache, key)
  #   end

  #   defp get_max_size() do
  #     [{_key, max_size, _nil_ttl}] = :ets.lookup(:cdn_cache, :__max_size)
  #     max_size
  #   end

  #   def purge() do
  #     now = :erlang.system_time(:second)

  #     # to be able to safely iterate thru an ETS table
  #     # (to handle additions/removals), we need to fix the table
  #     :ets.safe_fixtable(:t, true)

  #     # iterate thru the table
  #     purge(:ets.first(:t), now)
  #   after
  #     # release the table when we're done
  #     :ets.safe_fixtable(:t, false)
  #   end

  #   # we've deleted 100 keys, that's enough
  #   # defp purge(_, 100), do: :ok

  #   # we're at the end of the table
  #   defp purge(:"$end_of_table", _), do: :ok

  #   defp purge(key, now) do
  #     with [{_, _, expires_at}] <- :ets.lookup(:t, key),
  #          true <- expires_at < now
  #     do
  #       :ets.delete(:t, key)
  #     end
  #     purge(:ets.next(:t, key), now)
  #   end
end

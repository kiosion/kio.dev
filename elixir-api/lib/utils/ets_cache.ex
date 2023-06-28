defmodule Hexerei.Cache.Base do
  @moduledoc """
  Base logic for building simple ETS-based cache modules
  """

  defmacro __using__(opts) do
    table_name = opts[:table_name] || :default_table
    default_ttl = opts[:default_ttl] || 2 * 60 * 60

    quote do
      use GenServer
      use Supervisor

      require Logger

      defp get_table_name, do: unquote(table_name)
      defp get_default_ttl, do: unquote(default_ttl)

      def start_link(opts \\ []) do
        GenServer.start_link(__MODULE__, opts)
      end

      def init(opts) do
        max_size = Keyword.get(opts, :options, max_size: 200)[:max_size]

        Logger.info("Creating table #{get_table_name()} with max_size of #{max_size}")

        table =
          :ets.new(get_table_name(), [
            # gives key=> value semantics
            :set,

            # allows any process to read/write to the table
            :public,

            # allow ETS table to access by its name, ':cdn_cache'
            :named_table,

            # favor read-locks over write-locks
            read_concurrency: true,

            # internally split the ETS table into buckets in order
            # to reduce write-lock contention
            write_concurrency: true
          ])

        # Store the max_size in the ETS table as a regular entry, but with a nil key
        # for expires_at - since nil is always greater than any integer
        :ets.insert(get_table_name(), {:__max_size, max_size, nil})

        {:ok, []}
      end

      def get(key) do
        entry = :ets.lookup(get_table_name(), key)

        with [{_key, value, expires_at}] <- entry,
             true <- :erlang.system_time(:second) < expires_at do
          value
        else
          # key not found in ets
          [] ->
            nil

          false ->
            # key found but expired
            :ets.delete(get_table_name(), key)
            nil
        end
      end

      # default 'put', with default ttl
      def put(key, value) do
        put(key, value, get_default_ttl())
      end

      def put(key, value, ttl) do
        expires_at = :erlang.system_time(:second) + ttl
        entry = {key, value, expires_at}

        # Only purge if we're inserting a new value AND
        # we've reached our size limit
        # (If we're updating a value, then our size won't increase)
        if !exists?(key) && :ets.info(get_table_name(), :size) > get_max_size() do
          purge()
        end

        :ets.insert(get_table_name(), entry)
      end

      def exists?(key) do
        :ets.member(get_table_name(), key)
      end

      def delete(key) do
        :ets.delete(get_table_name(), key)
      end

      defp get_max_size do
        [{_key, max_size, _nil_ttl}] = :ets.lookup(get_table_name(), :__max_size)
        max_size
      end

      def purge do
        now = :erlang.system_time(:second)

        # to be able to safely iterate thru an ETS table
        # (to handle additions/removals), we need to fix the table
        :ets.safe_fixtable(:t, true)

        # iterate thru the table
        purge(:ets.first(:t), now)
      after
        # release the table when we're done
        :ets.safe_fixtable(:t, false)
      end

      # we've deleted 100 keys, that's enough
      defp purge(_, 100), do: :ok

      # we're at the end of the table
      defp purge(:"$end_of_table", _), do: :ok

      defp purge(key, now) do
        with [{_, _, expires_at}] <- :ets.lookup(:t, key),
             true <- expires_at < now do
          :ets.delete(:t, key)
        end

        purge(:ets.next(:t, key), now)
      end

      defoverridable start_link: 1, get_table_name: 0, get: 1, put: 3
    end
  end
end

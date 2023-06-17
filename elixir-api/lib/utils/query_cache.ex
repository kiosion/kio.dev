defmodule Hexerei.Cache.QueryCache do
  use Hexerei.Cache.Base, table_name: :query_cache

  defmacro __using__(_opts) do
    quote do
      alias Hexerei.Cache.QueryCache, as: QueryCache
    end
  end
end

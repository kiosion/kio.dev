defmodule Hexerei.Cache.TranslateCache do
  use Hexerei.Cache.Base, table_name: :translate_cache

  defmacro __using__(_opts) do
    quote do
      alias Hexerei.Cache.TranslateCache, as: TranslateCache
    end
  end
end

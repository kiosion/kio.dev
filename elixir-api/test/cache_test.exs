defmodule CacheTest do
  use ExUnit.Case, async: false

  require Hexerei.Cache.Base

  test "Base Cache can be extended" do
    defmodule TestCache do
      use Hexerei.Cache.Base, table_name: :test_table, default_ttl: 1
    end

    {:ok, pid} = TestCache.start_link()

    assert pid != nil

    # Remove temp module from VM
    :code.delete(TestCache)
  end

  test "Base Cache can be used" do
    defmodule TestCache do
      use Hexerei.Cache.Base, table_name: :test_table, default_ttl: 1
    end

    {:ok, _pid} = TestCache.start_link()

    assert TestCache.put(:some_key, :some_value) == true
    assert TestCache.get(:some_key) == :some_value
    assert TestCache.exists?(:some_key) == true
    assert TestCache.exists?(:some_other_key) == false
    assert TestCache.delete(:some_key) == true
    assert TestCache.exists?(:some_key) == false

    :code.delete(TestCache)
  end
end

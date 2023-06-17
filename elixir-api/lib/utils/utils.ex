defmodule Hexerei.Utils do
  @moduledoc """
  Generic utility funcs
  """

  use Hexerei.Response

  alias Hexerei.SanityClient, as: Sanity

  defmacro __using__(_opts) do
    quote do
      import Hexerei.Utils
    end
  end

  def validate_query_params(params, expected) do
    Enum.reduce(expected, %{}, fn {key, default}, acc ->
      if Map.has_key?(params, key) do
        Map.put(acc, key, params[key])
      else
        Map.put(acc, key, default)
      end
    end)
  end

  def params_to_integer(params, keys \\ [:limit, :skip]) do
    keys = Enum.map(keys, &to_string/1)

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
    end)
  end

  def empty_to_nil(params, keys \\ [:date]) do
    keys = Enum.map(keys, &to_string/1)

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
    end)
  end
end

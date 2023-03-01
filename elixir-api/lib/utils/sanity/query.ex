defmodule Hexerei.SanityClient.Query do
  @moduledoc """
  Module to act as a query-builder for Sanity.io - constructs GROQ queries using Elixir syntax
  """

  require Logger

  @doc """
  Start building a template for a query

  ## Options
    - `:include_drafts` - Include drafts in the query (default: false)
  """
  def new(opts \\ %{}) do
    include_drafts = Map.get(opts, :include_drafts, false)
    direct_query = Map.get(opts, :direct_query, false)
    %{
      base_query: if direct_query do "" else "*" end,
      filters: if include_drafts or direct_query do [] else [%{"_id" => ["in", "path('drafts.**')", :negate]}] end,
      projections: [],
      order: nil,
      limit: nil
    }
  end

  def filter(template, [key, val]) when not is_map(key) and not is_map(val) do
    filter(template, [%{key => val}])
  end
  def filter(template, filter) when is_map(filter) do
    filter(template, [filter])
  end
  def filter(template, filters) when is_list(filters) do
    if Enum.all?(filters, &is_map/1) do
      Map.put(template, :filters, template[:filters] ++ filters)
    else
      err = "Filters must be a list of maps"
      Logger.error err
      {:error, err, template}
    end
  end

  def filter!(template, [key, val]) when not is_map(key) and not is_map(val) do
    filter!(template, [%{key => val}])
  end
  def filter!(template, filter) when is_map(filter) do
    filter!(template, [filter])
  end
  def filter!(template, filters) when is_list(filters) do
    case filter(template, filters) do
      {:error, msg, _} -> raise msg
      res -> res
    end
  end

  def project(template, projections) do
    if is_list(projections) do
      Map.put(template, :projections, template[:projections] ++ projections)
    else
      err = "Projections must be a list of strings or nested maps"
      Logger.error err
      {:error, err, template}
    end
  end

  def project!(template, projections) do
    case project(template, projections) do
      {:error, msg, _} -> raise msg
      res -> res
    end
  end

  def order(template, order) do
    case order do
      order when is_binary(order) ->
        Map.put(template, :order, [order])
      order when is_list(order) ->
        Map.put(template, :order, order)
      _ ->
        err = "Order must be a string or a list of strings - Got '#{inspect(order)}' instead"
        Logger.error err
        {:error, err, template}
    end
  end

  def limit(template, limit) do
    case limit do
      {offset, limit} when is_integer(offset) and is_integer(limit) and offset >= 0 and limit > 0 ->
        Map.put(template, :limit, {offset, limit})
      limit when is_integer(limit) and limit > 0 ->
        Map.put(template, :limit, limit)
      {offset, limit} when is_integer(offset) and is_integer(limit) and offset == 0 and limit == 0 ->
        template
      limit when is_integer(limit) and limit == 0 ->
        template
      _ ->
        err = "Limit must be a positive integer or tuple of {offset, limit} - Got '#{inspect(limit)}' instead"
        Logger.error err
        {:error, err, template}
    end
  end

  def build(%{base_query: base_query, filters: filters, projections: projections, order: order, limit: limit}) do
    q = base_query
    |> add_filters(filters)
    |> add_projections(projections)
    |> add_order(order)
    |> add_limit(limit)

    IO.puts "Finished building query: #{q}"
    q
  end
  def build!(template) do
    case template do
      {:error, msg, _} -> raise msg
      _ -> build(template)
    end
  end

  defp add_filters(query, filters) do
    filters_string =
      filters
      |> Enum.map(&format_filter!/1)
      |> Enum.join(" && ")

    case filters_string do
      "" -> query
      _ -> query <> "[#{filters_string}]"
    end
  end

  defp format_filter!(filter) do
    case filter do
      %{} ->
        Enum.map(Enum.filter(filter, fn {key, _} -> is_binary(key) end), fn {key, value} ->
          case Map.get(filter, :nest, false) do
            true ->
              "#{key}(#{format_filter!(value)})"
            _ ->
              format_filter_pair(key, value)
          end
        end)
      {key, value} when is_binary(key) and is_binary(value) ->
        format_filter_pair(key, value)
      value when is_binary(value) ->
        value
      _ ->
        raise "Invalid filter format"
    end
  end

  defp format_filter_pair(key, value) do
    case value do
      [operator, value | opts] when is_binary(operator) and is_binary(value) ->
        negate = Enum.any?(opts, fn opt -> opt == :negate end)
        case negate do
          true ->
            "!(#{key} #{operator} #{value})"
          false ->
            "#{key} #{operator} #{value}"
        end
      [operator, value] when is_binary(operator) and is_binary(value) ->
        "#{key} #{operator} #{value}"
      _ ->
        "#{key} == #{value}"
    end
  end

  defp add_projections(query, projections) do
    query_length = String.length(query)
    case projections do
      nil ->
        query
      [] ->
        query
      # If only one projection is provided, don't wrap it in curly braces, as it can be a direct property access of the filter
      # However, only do this if filters are present, as otherwise it's a direct query (e.g. query length > 1)
      [projection] when query_length > 1 ->
        query <> ".#{projection}"
      _ ->
        query <> "{#{join_projections(projections)}}"
    end
  end

  defp join_projections(projections) do
    Enum.join(
      projections
      |> Enum.map(&format_projection/1),
      ", "
    )
  end

  defp format_projection(projection) when is_map(projection) do
    joiner = if Map.get(projection, :follow, false), do: "->", else: ":"
    Enum.join(
      Enum.map(Enum.filter(projection, fn {key, _} -> is_binary(key) end), fn {key, value} ->
        "#{key}#{joiner}{#{join_projections(value)}}"
      end),
      ", "
    )
  end

  defp format_projection([key, value]) do
    case value do
      value when is_list(value) ->
        "#{key}:#{format_projection(value)}"
      _ ->
        "#{key}:#{value}"
    end
  end
  defp format_projection([key, value, opt]) do
    joiner = if opt == :follow, do: "->", else: ":"
    case value do
      value when is_list(value) ->
        "#{key}#{joiner}{#{join_projections(value)}}"
      _ ->
        "#{key}#{joiner}#{value}"
    end
  end

  defp format_projection(projection) do
    projection
  end

  defp add_order(query, order) do
    case order do
      nil ->
        query
      _ ->
        query <> " | order(#{Enum.join(order, ", ")})"
    end
  end

  defp add_limit(query, limit) do
    case limit do
      nil ->
        query
      {offset, limit} ->
        query <> " [#{offset}...#{offset + limit}]"
      limit ->
        query <> " [0...#{limit}]"
    end
  end
end

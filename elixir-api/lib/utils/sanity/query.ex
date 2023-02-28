defmodule Hexerei.SanityClient.Query do
  @moduledoc """
  Module to act as a query-builder for Sanity.io - constructs GROQ queries using Elixir syntax
  """

  require Logger

  @doc """
  Start building a template
  """
  def new(drafts \\ false) do
    case drafts do
      true ->
        %{filters: [], projections: [], order: nil, limit: nil}
      false ->
        %{filters: [%{"_id" => {"in", "path('drafts.**')", true}}], projections: [], order: nil, limit: nil}
      _ ->
        Logger.warn "Drafts must be provided as a boolean"
        %{filters: [%{"_id" => {"in", "path('drafts.**')", true}}], projections: [], order: nil, limit: nil}
    end
  end

  def filter!(template, [key, val]) when not is_map(key) and not is_map(val) do
    filter!(template, [%{key => val}])
  end

  def filter!(template, filter) when is_map(filter) do
    filter!(template, [filter])
  end

  def filter!(template, filters) when is_list(filters) do
    if Enum.all?(filters, &is_map/1) do
      Map.put(template, :filters, template[:filters] ++ filters)
    else
      raise "Filters must be a list of maps"
    end
  end

  def project!(template, projections) do
    if is_list(projections) do
      Map.put(template, :projections, template[:projections] ++ projections)
    else
      raise "Projections must be a list of strings or nested maps"
    end
  end

  def order(template, order) do
    case order do
      order when is_binary(order) ->
        Map.put(template, :order, [order])
      order when is_list(order) ->
        Map.put(template, :order, order)
      _ ->
        Logger.warn "Order must be a string or a list of strings"
        template
    end
  end

  def limit(template, limit) do
    case limit do
      {offset, limit} when is_integer(offset) and is_integer(limit) and offset >= 0 and limit > 0 ->
        Map.put(template, :limit, {offset, limit})
      limit when is_integer(limit) and limit > 0 ->
        Map.put(template, :limit, limit)
      _ ->
        Logger.warn "Limit must be a positive integer, or a tuple of {offset, limit}"
        template
    end
  end

  def build(%{filters: filters, projections: projections, order: order, limit: limit}) do
    "*"
    |> add_filters(filters)
    |> add_projections(projections)
    |> add_order(order)
    |> add_limit(limit)
  end

  defp add_filters(query, filters) do
    filters_string =
      filters
      |> Enum.map(&format_filter/1)
      |> Enum.join(" && ")

    query <> "[#{filters_string}]"
  end

  defp format_filter(filter) do
    case filter do
      %{} ->
        Enum.map(filter, fn {key, value} ->
          format_filter_pair(key, value)
        end)
      # If it's a simple string, leave it as is
      {key, value} when is_binary(key) and is_binary(value) ->
        format_filter_pair(key, value)
      _ ->
        raise "Invalid filter format"
    end
  end

  defp format_filter_pair(key, value) do
    case value do
      {operator, value, negate} when negate ->
        "!(#{key} #{operator} #{value})"
      {operator, value} ->
        "#{key} #{operator} #{value}"
      _ ->
        "#{key} == #{value}"
    end
  end

  defp add_projections(query, projections) do
    case projections do
      nil ->
        query
      [] ->
        query
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
    Enum.join(
      Enum.map(projection, fn {key, value} ->
        "#{key}: {#{join_projections(value)}}"
      end),
      ", "
    )
  end

  defp format_projection([key, value]) do
    "#{key}: #{value}"
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

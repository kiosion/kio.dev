defmodule Hexerei.Sanity.Query do
  alias __MODULE__

  # Struct definition for pieces of GROQ query we want to piece together
  defstruct [
    # Filter for the query (e.g. _type == 'post')
    :filter,
    # Projection (e.g. fields to return - _id, title, etc.)
    :project,
    :sort,
    :slice
  ]

  @doc """
  Creates a new Hexerei.Sanity.Query struct.
  """
  @spec new :: %Query{filter: [], project: nil}
  def new() do
    %Query{
      filter: [],
      project: nil,
      sort: nil,
      slice: nil
    }
  end

  # First filter added should include "[" and last should include "]"
  def add_filter(query, filter) do
    if query.filter == [] do
      filter = "[#{filter}"
    end
    if query.filter != [] do
      filter = ", #{filter}"
    end
    %Query{query | filter: query.filter ++ [filter]}
  end
  # def add_filter(query)

  #
end

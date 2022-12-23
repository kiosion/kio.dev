defmodule Hexerei.SanityClient do
  @moduledoc """
  Module to act as a client for Sanity.io, handling queries, responses, and errors
  """

  # Set variables from env
  @sanity_project_id Hexerei.Env.get!(:sanity_project_id)
  @sanity_dataset Hexerei.Env.get!(:sanity_dataset)
  @sanity_token Hexerei.Env.get!(:sanity_token)
  @sanity_api_version Hexerei.Env.get!(:sanity_api_version)
  @sanity_apicdn Hexerei.Env.get!(:sanity_apicdn)

  # Set headers
  @headers [
    {"Content-Type", "application/json"},
    {"Authorization", "Bearer #{@sanity_token}"},
    {"Accept", "application/json"}
  ]

  @doc """
  Send a query to the Sanity API and await a response

  Returns body of response as string on success, error as `%{code, message}` on failure

  ## Examples

      iex> Hexerei.SanityClient.fetch("*[_type == 'post']{title, slug, _id}")
      {:ok, data} | {:error, %{code, message}}
  """
  @doc since: "0.1.0"
  def fetch(query) do
    # Return error if query is not a string or is empty
    if is_binary(query) and query != "" do
      url = "https://#{@sanity_project_id}.api#{if @sanity_apicdn == true do "cdn" end}.sanity.io/v#{@sanity_api_version}/data/query/#{@sanity_dataset}"

      query = URI.encode_query(%{"query" => query})
      url = url <> "?" <> query

      # Send GET request and return the body
      case HTTPoison.get(url, @headers) do
        {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
          {:ok, body}

        {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
          {:error, %{code: status_code, message: "Sanity error: #{body}"}}

        {:error, %HTTPoison.Error{reason: reason}} ->
          {:error, %{code: 500, message: "Sanity error: #{reason}"}}
      end
    else
      {:error, %{code: 400, message: "Query must be a string and not empty"}}
    end
  end

  @doc """
  Get CDN URL for a given Sanity image asset ID

  Returns URL as string on success, nil on failure

  ## Examples

      iex> Hexerei.SanityClient.get_image_url("image-asset-id")
      "https://cdn.sanity.io/images/..."
  """
  @doc since: "0.1.0"
  def urlFor(assetID, queryParams) do
    # Return nil if asset is not a string or is empty
    if is_binary(assetID) and assetID != "" do
      url = "https://cdn.sanity.io/images/#{@sanity_project_id}/#{@sanity_dataset}/" <> assetID

      if not is_binary(queryParams) or queryParams == "" do
        {:ok, url}
      end

      {:ok, url <> "?" <> queryParams}
    else
      {:error, nil}
    end
  end
end
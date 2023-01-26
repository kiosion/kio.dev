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

  @base_url "https://#{@sanity_project_id}.api#{if @sanity_apicdn == true do "cdn" end}.sanity.io/v#{@sanity_api_version}/data/query/#{@sanity_dataset}"
  @base_asset_url "https://cdn.sanity.io/images/#{@sanity_project_id}/#{@sanity_dataset}/"

  # Set headers
  @headers [
    {"Content-Type", "application/json"},
    {"Authorization", "Bearer #{@sanity_token}"},
    {"Accept", "application/json"}
  ]

  @doc """
  Simple helper function to check a given string or list of strings for validity
  """
  defp is_valid_string?(string) do
    is_binary(string) and String.trim(string) != ""
  end
  defp is_valid_string?(strings) when is_list(strings) do
    Enum.all?(strings, &is_valid_string?/1)
  end

  @doc """
  Send a query to the Sanity API and await a response

  Returns body of response as string on success, error as `%{code, message}` on failure

  ## Examples

      iex> Hexerei.SanityClient.fetch("*[_type == 'post']{title, slug, _id}")
      {:ok, data} | {:error, %{code, message}}
  """
  def fetch(query) do
    case !is_valid_string?(query) do
      true -> {:error, %{code: 400, message: "Query must be a string and not empty"}}
      _ ->
        query = URI.encode_query(%{"query" => query})
        url = @base_url <> "?" <> query

        # Send GET request and return the body
        case HTTPoison.get(url, @headers) do
          {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
            {:ok, body}

          {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
            {:error, %{code: status_code, message: "Sanity error: #{body}"}}

          {:error, %HTTPoison.Error{reason: reason}} ->
            {:error, %{code: 500, message: "Sanity error: #{reason}"}}
        end
    end
  end

  @doc """
  Get CDN URL for a given Sanity image asset ID

  Returns URL as string on success, nil on failure

  ## Examples

      iex> Hexerei.SanityClient.get_image_url("image-asset-id")
      "https://cdn.sanity.io/images/..."
  """
  def urlFor(assetID, queryParams) do
    # Check all params are valid
    case is_valid_string?(assetID) do
      true ->
        url = @base_asset_url <> assetID
        case is_valid_string?(queryParams) do
          true -> {:ok, url <> "?" <> queryParams}
          false -> {:ok, url}
        end
      false-> {:error, nil}
    end
  end
end

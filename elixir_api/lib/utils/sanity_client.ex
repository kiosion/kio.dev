defmodule Hexerei.SanityClient do
  # Set variables from env
  @sanity_project_id Application.compile_env!(:hexerei, :sanity_project_id)
  @sanity_dataset Application.compile_env!(:hexerei, :sanity_dataset)
  @sanity_token Application.compile_env!(:hexerei, :sanity_token)
  @sanity_api_version Application.compile_env!(:hexerei, :sanity_api_version)

  # Set headers
  @headers [
    {"Content-Type", "application/json"},
    {"Authorization", "Bearer #{@sanity_token}"},
    {"Accept", "application/json"}
  ]

  # Methods
  def fetch(query) do
    # Send a query to the Sanity API
    #
    # Arguments:
    #   query: String
    #
    # Returns:
    #   {:ok, body} | {:error, reason}

    # Return error if query is not a string or is empty
    if is_binary(query) and query != "" do
      # Set URL
      url = "https://#{@sanity_project_id}.api.sanity.io/v#{@sanity_api_version}/data/query/#{@sanity_dataset}"

      # Print url to console
      IO.inspect(url)

      # URL encode query string
      query = URI.encode_query(%{"query" => query})

      # Append query to URL
      url = url <> "?" <> query

      # Print url to console
      IO.inspect(url)

      # Send GET request and return the body
      case HTTPoison.get(url, @headers) do
        {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
          {:ok, body}

        {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
          {:error, "Sanity API returned status code #{status_code} with body: #{body}"}

        {:error, %HTTPoison.Error{reason: reason}} ->
          {:error, "Sanity API returned error: #{reason}"}
      end
    else
      {:error, "Query must be a string and not empty"}
    end
  end

  def urlFor(assetID, queryParams) do
    # Get the API CDN URL for a given asset ID
    #
    # Arguments:
    #   assetID: String
    #   queryParams: String
    #
    # Returns:
    #   String | nil

    # Return nil if asset is not a string or is empty
    if is_binary(assetID) and assetID != "" do
      url = "https://cdn.sanity.io/images/#{@sanity_project_id}/#{@sanity_dataset}/" <> assetID

      if not is_binary(queryParams) or queryParams == "" do
        url
      end

      url <> "?" <> queryParams
    else
      nil
    end
  end
end

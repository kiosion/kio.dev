defmodule Hexerei.SanityClient do
  @moduledoc """
  Module to act as a client for Sanity.io, handling queries, responses, and errors
  """

  require Logger

  defp get_base_url do
    project_id = Hexerei.Env.get!(:sanity_project_id)
    api_version = Hexerei.Env.get!(:sanity_api_version)
    dataset = Hexerei.Env.get!(:sanity_dataset)
    apicdn = Hexerei.Env.get!(:sanity_apicdn)

    with {:ok, _} <- is_valid_string?(project_id),
         {:ok, _} <- is_valid_string?(api_version),
         {:ok, _} <- is_valid_string?(dataset) do
      "https://#{project_id}.api" <>
        if(apicdn == true, do: "cdn", else: "") <>
        ".sanity.io/v#{api_version}/data/query/#{dataset}"
    else
      _ ->
        Logger.error("Sanity Client: Failed to load expected environment variables for base_url")
        nil
    end
  end

  defp get_patch_url do
    project_id = Hexerei.Env.get!(:sanity_project_id)
    api_version = Hexerei.Env.get!(:sanity_api_version)
    dataset = Hexerei.Env.get!(:sanity_dataset)

    with {:ok, _} <- is_valid_string?(project_id),
         {:ok, _} <- is_valid_string?(api_version),
         {:ok, _} <- is_valid_string?(dataset) do
      "https://#{project_id}.api.sanity.io/v#{api_version}/data/mutate/#{dataset}"
    else
      _ ->
        Logger.error("Sanity Client: Failed to load expected environment variables for patch_url")
        nil
    end
  end

  defp get_base_asset_url do
    with project_id <- Hexerei.Env.get!(:sanity_project_id),
         dataset <- Hexerei.Env.get!(:sanity_dataset) do
      "https://cdn.sanity.io/images/#{project_id}/#{dataset}/"
    else
      _ ->
        Logger.error(
          "Sanity Client: Failed to load expected environment variables for base_asset_url"
        )

        nil
    end
  end

  defp sanity_token, do: Hexerei.Env.get!(:sanity_token)

  defp get_headers,
    do: [
      {"Content-Type", "application/json"},
      {"Authorization", "Bearer #{sanity_token()}"},
      {"Accept", "application/json"}
    ]

  defp is_valid_string?(string) do
    case is_binary(string) and String.trim(string) != "" do
      true -> {:ok, string}
      _ -> {:error, string}
    end
  end

  @doc """
  Send a query to the Sanity API and await a response

  Returns body of response as string on success, error as `%{code, message}` on failure

  ## Examples

      iex> Hexerei.SanityClient.fetch("*[_type == 'post']{title, slug, _id}")
      {:ok, data} | {:error, %{code, message}}
  """
  def fetch(query) do
    with {:ok, query} <- is_valid_string?(query) do
      query = URI.encode_query(%{"query" => query})
      url = get_base_url() <> "?" <> query

      Logger.info("Sanity Client: Sending GET request to #{url}")

      case Hexerei.Env.get(:http_client, Hexerei.HTTP.DefaultClient).get(
             url,
             get_headers()
           ) do
        {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
          {:ok, body}

        {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
          {:error, %{code: status_code, message: "Sanity error: #{body}"}}

        {:error, %HTTPoison.Error{reason: reason}} ->
          {:error, %{code: 500, message: "Sanity error: #{reason}"}}
      end
    else
      {:error, _} -> {:error, %{code: 400, message: "Query must be a string and not empty"}}
    end
  end

  @doc """
  Send a transactional mutation to the sanity API.

  ## Examples
      iex> Hexerei.SanityClient.patch(
          "*[_type == 'post' && _id == 'abc']",
          %{ "set" => %{ "name" => "John Doe" } }
        )
      {:ok, data} | {:error, %{code, message}}
  """
  def patch(query, changeset) when is_binary(query) and is_map(changeset) do
    url = get_patch_url()

    transactions = %{
      "mutations" => [
        %{"patch" => Map.merge(%{"query" => query}, changeset)}
      ]
    }

    payload = Poison.encode!(transactions)

    Logger.info("Sanity Client: Sending mutation to #{url}: #{inspect(payload)}")

    case Hexerei.Env.get(:http_client, Hexerei.HTTP.DefaultClient).post(
           url,
           payload,
           get_headers()
         ) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, body}

      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        {:error, %{code: status_code, message: "Sanity error: #{body}"}}

      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, %{code: 500, message: "Sanity error: #{reason}"}}
    end
  end

  def patch(_query, _changeset) do
    {:error, %{code: 400, message: "Query must be binary and changeset must be a valid map"}}
  end

  @doc """
  Get CDN URL for a given Sanity image asset ID

  Returns URL as string on success, nil on failure

  ## Examples

      iex> Hexerei.SanityClient.get_image_url("image-asset-id")
      "https://cdn.sanity.io/images/..."
  """
  def urlFor(assetID, queryParams) do
    case is_valid_string?(assetID) do
      {:ok, _} ->
        url = get_base_asset_url() <> assetID

        case is_valid_string?(queryParams) do
          {:ok, _} -> {:ok, url <> "?" <> queryParams}
          {:error, _} -> {:ok, url}
        end

      {:error, _} ->
        {:error, nil}
    end
  end
end

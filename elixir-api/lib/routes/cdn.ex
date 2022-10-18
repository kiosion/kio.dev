defmodule Router.Cdn do
  @moduledoc """
  Plug router to handle all CDN requests
  """

  use Plug.Router
  use Plug.ErrorHandler

  plug(:match)

  plug(:fetch_query_params)

  plug(:dispatch)

  defp parse_url(url) do
    # Split url on '?' if it exists
    [url, query] = try do
      String.split(url, "?", parts: 2)
    rescue
      _ -> [url, nil]
    end

    # Split url on '/' and get last element
    asset = List.last(String.split(url, "/"))

    # Get filetype from asset by splitting on '.' if present
    split_asset = String.split(asset, ".", parts: 2)

    # If split_asset has 2 elements, we have a filetype
    [_, filetype] = if length(split_asset) == 2 do
      split_asset
    else
      [asset, nil]
    end

    # Return map with asset, query and file_ext
    %{
      asset: asset,
      query: if query == nil do "" else query end,
      filetype: filetype
    }
  end

  ## Routes

  # Parse image asset URLs
  get "/images/*path" do
    # Get full request url including query params
    url = conn.request_path <> "?" <> conn.query_string

    url_parts = parse_url(url)

    if url_parts.filetype == nil do
      Hexerei.Res.err(conn, 400, "No filetype specified")
    end

    case Hexerei.SanityClient.urlFor(url_parts.asset, conn.query_string) do
      {:ok, url} ->
        case HTTPoison.get(url) do
          {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
            conn
            |> put_resp_content_type("image/#{url_parts.filetype}")
            |> send_resp(200, body)
            |> halt()
          {:ok, %HTTPoison.Response{status_code: 404}} ->
            Hexerei.Res.err(conn, 404, "Image not found")
          {:ok, %HTTPoison.Response{status_code: 400}} ->
            Hexerei.Res.err(conn, 400, "Bad request")
          {:ok, %HTTPoison.Response{}} ->
            Hexerei.Res.err(conn, 500, "Something went wrong")
          {:error, %HTTPoison.Error{reason: reason}} ->
            Hexerei.Res.err(conn, 500, "Something went wrong: #{reason}")
        end
      {:error, reason} ->
        Hexerei.Res.err(conn, 500, reason)
    end
  end

  # Fallback route
  match _ do
    Hexerei.Res.json(conn, 404, %{code: 404, message: "Not found"})
  end

  # Handle unexpected errors
  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    Hexerei.Res.err(conn, 500, "Something went wrong")
  end
end

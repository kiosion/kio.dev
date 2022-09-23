defmodule Router.Cdn do
  @moduledoc """
  Plug router to handle all CDN requests
  """

  use Plug.Router
  use Plug.ErrorHandler

  @sanity_project_id Application.compile_env(:hexerei, :sanity_project_id)
  @sanity_dataset Application.compile_env(:hexerei, :sanity_dataset)

  plug(Plug.Logger)

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  plug(:dispatch)

  defp json_res(conn, status, res) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(status, Poison.encode!(res))
  end

  defp parse_url(url) do
    # Log url
    IO.inspect("parsing url: #{url}")
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

  # Parse image asset URLs
  get "/images/*path" do

    # Get full request url including query params
    url = conn.request_path <> "?" <> conn.query_string

    # Parse url
    url_parts = parse_url(url)

    # filetype shouldn't be nil
    if url_parts.filetype == nil do
      handle_error(conn, 400, "No filetype specified")
    end

    # end

    # Log url_parts to console
    IO.inspect(url_parts)

    # sanityUrl = "https://cdn.sanity.io/images/#{@sanity_project_id}/#{@sanity_dataset}/#{url}"

    # For now, just return the path using json_res
    json_res(conn, 200, %{code: 200, message: "OK", data: url_parts})
  end

  get "/" do
    json_res(conn, 200, %{code: 200, message: "CDN is up!"})
  end

  # Fallback route
  match _ do
    json_res(conn, 404, %{code: 404, message: "Not found"})
  end

  # Handle intentional errors
  defp handle_error(conn, code, reason) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(code, Poison.encode!(%{code: code, message: reason}))
  end

  # Handle unexpected errors
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    conn
    |> put_resp_content_type("application/json")
    |> put_resp_header("cache-control", "no-cache")
    |> send_resp(500, Poison.encode!(%{code: 500, message: "Something went wrong"}))
  end
end

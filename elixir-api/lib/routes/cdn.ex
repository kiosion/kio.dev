defmodule Router.Cdn do
  @moduledoc """
  Plug router to handle all CDN requests
  """

  use Plug.Router
  use Plug.ErrorHandler
  use Hexerei.Response

  plug(:match)
  plug(:fetch_query_params)
  plug(:dispatch)

  defp parse_url(url) do
    [url, query] =
      try do
        String.split(url, "?", parts: 2)
      rescue
        _ -> [url, nil]
      end

    asset = List.last(String.split(url, "/"))
    split_asset = String.split(asset, ".", parts: 2)

    [_, filetype] =
      if length(split_asset) == 2 do
        split_asset
      else
        [asset, nil]
      end

    %{
      asset: asset,
      query:
        if query == nil do
          ""
        else
          query
        end,
      filetype: filetype
    }
  end

  get "/images/*path" do
    url = conn.request_path <> "?" <> conn.query_string
    url_parts = url |> parse_url()

    with true <- is_binary(url_parts.filetype),
         {:ok, url} <- Hexerei.SanityClient.urlFor(url_parts.asset, conn.query_string) do
      with {:ok, %HTTPoison.Response{status_code: 200, body: body}} <-
             Hexerei.Env.get(:http_client, Hexerei.HTTP.DefaultClient).get(url) do
        conn
        |> put_resp_header("Access-Control-Allow-Origin", "*")
        |> put_resp_content_type("image/#{url_parts.filetype}")
        |> send_resp(200, body)
      else
        {:ok, %HTTPoison.Response{status_code: 404}} ->
          error_res(conn, 404, "Image not found")

        {:ok, %HTTPoison.Response{status_code: 400}} ->
          error_res(conn, 400, "Bad request")

        {:ok, %HTTPoison.Response{}} ->
          error_res(conn, 500, "Something went wrong")

        {:error, %HTTPoison.Error{reason: reason}} ->
          error_res(conn, 500, "Something went wrong", [reason])
      end
    else
      {:error, reason} ->
        conn |> error_res(500, reason)

      _ ->
        conn
        |> error_res(400, "Invalid request", [%{message: "No filetype specified or invalid URL"}])
    end
  end

  match _ do
    conn |> error_res(404, "Not found")
  end

  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    conn |> generic_error()
  end
end

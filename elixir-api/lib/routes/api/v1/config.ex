defmodule Router.Api.V1.Config do
  use Router.Api.Base

  options "/" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "GET, OPTIONS")
    |> put_resp_header("cache-control", "max-age=7200, must-revalidate")
    |> send_resp(200, "")
  end

  get "/" do
    with {:ok, params} <- validate_query_params(conn, %{"lang" => "en"}) do
      query =
        Query.new()
        |> Query.filter([%{"_type" => "'siteSettings'"}])
        |> Query.qualify("[0]")
        |> Query.build!()

      conn
      |> handle_sanity_fetch(
        query,
        fn conn, result, duration ->
          {transformed_result, meta, code} =
            transform_result_document(query, result, :config, params)

          update_meta_and_send_response(conn, code, transformed_result, meta, duration)
        end
      )
    else
      {:error, reason} ->
        conn
        |> error_res(400, "Invalid request", [
          %{message: "Invalid or malformed params", detail: reason}
        ])
    end
  end
end

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
    conn
    |> handle_sanity_fetch(
      Query.new()
      |> Query.filter([%{"_type" => "'siteSettings'"}])
      |> Query.qualify("[0]")
      |> Query.build!(),
      fn conn, result ->
        result
        |> Map.delete("ms")
        |> (fn data -> conn |> json_res(200, %{code: 200, data: data}) end).()
      end
    )
  end
end
defmodule Router.Api.V1.Inc do
  use Router.Api.Base, parse: true

  options "/" do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "POST, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "accept, authorization, content-type")
    |> put_resp_header("allow", "POST, OPTIONS")
    |> send_resp(200, "")
  end

  @spec handle_inc(Plug.Conn.t(), binary(), binary()) :: Plug.Conn.t()
  def handle_inc(conn, id, target) when is_binary(target) do
    Logger.info("Incrementing view count for #{id}")
    Logger.info("Incrementing for target: #{target}")

    if target == "views" do
      query = "*[_id == '#{id}'][0]"
      {:ok, _pid} = try_increment_view_count(query)

      receive do
        {:increment_view_count_done, result} ->
          case result do
            :ok ->
              conn
              |> json_res(200, %{code: 200, data: %{id: id, target: "views"}})

            :error ->
              conn
              |> error_res(500, "Internal Server Error", "Failed to increment view count")
          end
      after
        5000 ->
          conn
          |> error_res(504, "Gateway Timeout", "Timeout waiting for view count increment")
      end
    else
      conn |> error_res(400, "Bad Request", "Invalid target")
    end
  end

  def handle_inc(conn, _id, _target),
    do: conn |> error_res(400, "Bad Request", "Invalid body content")

  post "/:id" do
    if is_binary(conn.params["id"]) do
      try do
        {:ok, body, _conn} = read_body(conn)

        # No fucking clue why this isn't working with *just* `read_body/1`
        # Do not have the energy so this shall do for now.
        decoded_body =
          case Poison.decode(body) do
            {:ok, decoded_body} when is_map(decoded_body) -> decoded_body
            _ -> conn.body_params
          end

        handle_inc(conn, conn.params["id"], decoded_body["target"])
      rescue
        e ->
          Logger.error("Failed to increment view count: #{inspect(e)}")
          conn |> error_res(400, "Bad Request", "Invalid body content")
      end
    else
      conn |> error_res(400, "Bad Request", "Invalid ID")
    end
  end
end

defmodule Hexerei.Router do
  @moduledoc """
  Main router module
  """

  use Plug.Router
  use Plug.ErrorHandler
  use Hexerei.Response

  plug(Plug.Logger)

  @application_version Application.spec(:hexerei, :vsn) |> to_string()

  forward("/api", to: Router.Api)
  forward("/cdn", to: Router.Cdn)

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  plug(:dispatch)

  get "/" do
    conn |> json_res(418, %{code: 418, message: "Do I look like a coffee pot to you??"})
  end

  get "/healthcheck" do
    # Call memsup with Kernel.then since it's not synchronous
    mem = :memsup.get_system_memory_data()
    |> Kernel.then(fn data ->
      # memsup returns a linked list of keywords, I think either Keyword.get() or Enum.find() would work here
      %{
        :total => round(data[:system_total_memory] / 1024 / 1024),
        :free => round(data[:free_memory] / 1024 / 1024),
        :used => round((data[:system_total_memory] - data[:free_memory]) / 1024 / 1024),
      }
    end)

    upt = System.system_time(:millisecond) - Application.get_env(:hexerei, :started_at)
    elixir = to_string(System.version())
    otp = to_string(:erlang.system_info(:otp_release))
    spec = Application.spec(:hexerei) |> Enum.into(%{})
    app_name = to_string(spec.description)
    app_version = to_string(spec.vsn)

    # For now, just return 'ok' for statuses until monitoring is done
    statusInfo = %{
      "status" => %{
        "self" => "ok",
        "sanity" => "ok"
      },
      "runtime" => %{
        "self" => "#{app_name} v#{app_version}",
        "elixir" => elixir,
        "otp" => otp,
      },
      "usage" => "#{Map.get(mem, :used)}/#{Map.get(mem, :total)} MB",
      "uptime" => "#{upt / 1000 / 60 / 60 / 24 |> Float.floor() |> Kernel.trunc()}d #{upt / 1000 / 60 / 60 |> Float.floor() |> Kernel.trunc()}h #{upt / 1000 / 60 |> Float.floor() |> Kernel.trunc()}m",
    }

    conn |> json_res(200, %{code: 200, data: statusInfo })
  end

  # Fallback route
  match _ do
    conn |> json_res(404, %{code: 404, message: "Resource not found or method not allowed"})
  end

  # Error handling
  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    conn |> generic_error()
  end
end

defmodule Hexerei.Router do
  @moduledoc """
  Main router module
  """

  use Plug.Router
  use Plug.ErrorHandler

  use Hexerei.Response

  plug(Plug.Logger)

  @spec div_sub(integer, integer) :: tuple
  defp div_sub(upt, divisor) do
    result = upt |> div(divisor)
    upt = upt - (result * divisor)
    {result, upt}
  end

  @spec uptime_string(integer) :: tuple
  defp uptime_string(upt) do
    days_in_ms = 86_400_000
    hours_in_ms = 3_600_000
    minutes_in_ms = 60_000
    seconds_in_ms = 1_000

    {days, upt} = div_sub(upt, days_in_ms)
    {hours, upt} = div_sub(upt, hours_in_ms)
    {minutes, upt} = div_sub(upt, minutes_in_ms)

    seconds = upt
    |> div(seconds_in_ms)
    |> round()
    |> Kernel.+(Kernel.round(Enum.random(-5..5)))
    |> Kernel.rem(60)
    |> Kernel.max(0)

    %{
      :days => days,
      :hours => hours,
      :minutes => minutes,
      :seconds => seconds
    }
  end

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

  get "/info" do
    # Call memsup with Kernel.then since it's not synchronous
    mem = :memsup.get_system_memory_data()
    |> Kernel.then(fn data ->
      %{
        :total => Kernel.round(data[:system_total_memory] / 1024 / 1024 / 128),
        :free => Kernel.round(data[:free_memory] / 1024 / 1024 / 128),
        :used => Kernel.round((data[:system_total_memory] - data[:free_memory]) / 1024 / 1024 / 128),
      }
    end)

    sanity = with {:ok, result} <- Hexerei.SanityClient.fetch("{ 'total': count(*[_type == 'post']) }") do
      result = Poison.decode!(result)
      if result["result"]["total"] != nil do
        true
      else
        false
      end
    else
      _ -> false
    end

    upt = System.system_time(:millisecond) - Hexerei.Env.get!(:started_at)
    elixir = to_string(System.version())
    otp = to_string(:erlang.system_info(:otp_release))
    spec = Application.spec(:hexerei) |> Enum.into(%{})
    app_name = to_string(spec.description)
    app_version = to_string(spec.vsn)
    app_uptime = uptime_string(upt)

    statusInfo = %{
      "status" => %{
        "self" => "ok",
        "sanity" => if sanity do "ok" else "error" end,
      },
      "runtime" => %{
        "self" => "#{app_name} v#{app_version}",
        "elixir" => elixir,
        "otp" => otp,
      },
      "usage" => "#{Map.get(mem, :used)}/#{Map.get(mem, :total)} MB",
      "uptime" => "#{app_uptime.days}d #{app_uptime.hours}h #{app_uptime.minutes}m #{app_uptime.seconds}s"
    }

    conn |> json_res(200, %{code: 200, data: statusInfo })
  end

  # Fallback route
  match _ do
    conn |> error_res(404, "Not Found", "Resource not found or method not allowed: #{conn.method} #{conn.request_path}")
  end

  # Error handling
  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    conn |> generic_error()
  end
end

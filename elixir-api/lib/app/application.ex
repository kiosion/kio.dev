defmodule Hexerei.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {
        Plug.Cowboy,
        scheme: :http,
        plug: Hexerei.Router,
        options: [
          port: port()
        ]
      },
      {
        Plug.Cowboy.Drainer,
        refs: [
          :all
        ]
      }
    ]

    opts = [strategy: :one_for_one, name: __MODULE__]

    CliSpinners.spin_fun([frames: :simple_dots_scrolling, text: "Starting Hexerei", done: "Started Hexerei"], fn ->
      case Supervisor.start_link(children, opts) do
        {:ok, pid} ->
          Application.put_env(:hexerei, :started_at, System.system_time(:millisecond))
          # Disable non-essential logging from SASL (erlang:alarm_handler)
          Application.put_env(:sasl, :errlog_type, :error)
          Application.ensure_all_started(:os_mon)
          :timer.sleep(500)
          {:ok, pid}
        {:error, reason} -> {:error, reason}
      end
    end)
  end

  defp port, do: Hexerei.Env.get!(:port)
end

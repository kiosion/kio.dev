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
          port: Application.get_env(:hexerei, :port)
        ]
      },
      {
        Plug.Cowboy.Drainer, refs: [Hexerei.Router]
      }
    ]

    CliSpinners.spin_fun([frames: :simple_dots_scrolling, text: "Starting Hexerei", done: "Started Hexerei"], fn ->
      :timer.sleep(500)
      case Supervisor.start_link(children, [strategy: :one_for_one, name: Hexerei.Supervisor]) do
        {:ok, pid} ->
          Application.put_env(:hexerei, :started_at, System.system_time(:millisecond))
          # Disable non-essential logging from SASL (erlang:alarm_handler)
          Application.put_env(:sasl, :errlog_type, :error)
          # Start os_mon
          Application.ensure_all_started(:os_mon)
          :timer.sleep(500)
          # Return pid of the supervisor
          {:ok, pid}
        {:error, reason} -> {:error, reason}
      end
    end)
  end
end

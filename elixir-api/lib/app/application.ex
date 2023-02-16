defmodule Hexerei.Application do
  use Application

  require Logger

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
      },
      {
        Hexerei.CDNCache,
        [
          options: [
            max_size: 256
          ]
        ]
      }
    ]

    opts = [strategy: :one_for_one, name: __MODULE__]

    # Start up our :cdn_cache ETS table with an initial max_size of 1000
    # Hexerei.CDNCache.setup(1000)

    start_res = CliSpinners.spin_fun([frames: :simple_dots_scrolling, text: "Starting Hexerei", done: "Started Hexerei"], fn ->
      case Supervisor.start_link(children, opts) do
        {:ok, pid} ->
          Application.put_env :hexerei, :started_at, {"STARTED_AT", System.system_time(:millisecond), :int}
          :timer.sleep 500
          Application.ensure_all_started :os_mon
          {:ok, pid}
        {:error, reason} -> {:error, reason}
      end
    end)

    case start_res do
      {:ok, pid} ->
        Logger.info "Listening on port #{port()}"
        {:ok, pid}
      {:error, reason} -> {:error, reason}
    end
  end

  defp port, do: Hexerei.Env.get!(:port)
end

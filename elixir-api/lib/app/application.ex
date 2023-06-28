defmodule Hexerei.Application do
  use Application

  require Logger

  @impl true
  def start(_type, _args) do
    port = port()
    Logger.info("Starting Hexerei on port #{port}")

    children = [
      {
        Plug.Cowboy,
        scheme: :http,
        plug: Hexerei.Router,
        options: [
          port: port
          # ip: {127, 0, 0, 1},
          # Explicitly specify IPv4 using :inet, IPv6 using :inet6
          # net: :inet
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
            max_size: 100
          ]
        ]
      },
      {
        Hexerei.Cache.QueryCache,
        [
          options: [
            max_size: 200
          ]
        ]
      }
    ]

    opts = [strategy: :one_for_one, name: __MODULE__]

    start_res =
      case Supervisor.start_link(children, opts) do
        {:ok, pid} ->
          Application.put_env(
            :hexerei,
            :started_at,
            {"STARTED_AT", System.system_time(:millisecond), :int}
          )

          Application.ensure_all_started(:os_mon)
          {:ok, pid}

        {:error, reason} ->
          {:error, reason}
      end

    case start_res do
      {:ok, pid} ->
        Logger.info("Started Hexerei")
        {:ok, pid}

      {:error, reason} ->
        Logger.error("Failed to start Hexerei: #{inspect(reason)}")
        {:error, reason}
    end
  end

  defp port() do
    case Hexerei.Env.get!(:port) do
      var when is_integer(var) ->
        var

      var when is_binary(var) ->
        String.to_integer(var)

      nil ->
        Logger.warn("No port specified, falling back to 8080")
        8080

      var ->
        raise "Invalid port data type: #{inspect(var)}"
    end
  end
end

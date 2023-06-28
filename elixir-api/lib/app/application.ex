defmodule Hexerei.Application do
  use Application

  require Logger

  @impl true
  def start(_type, _args) do
    Logger.info("Starting Hexerei")

    children = [
      {
        Plug.Cowboy,
        scheme: :http,
        plug: Hexerei.Router,
        options: [
          port: String.to_integer(port())
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
      }
    ]

    children =
      with redis_uri <- Hexerei.Env.get!(:redis_uri),
           true <- redis_uri != nil and redis_uri != "" do
        children ++
          [
            {
              Hexerei.RedisCache,
              redis_uri
            }
          ]
      else
        _ ->
          Logger.error(
            "Invalid Redis URI, not attempting to connect: #{inspect(Hexerei.Env.get!(:redis_uri))}"
          )

          children
      end

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
        Logger.info("Listening on port #{port()}")
        {:ok, pid}

      {:error, reason} ->
        Logger.error("Failed to start Hexerei: #{inspect(reason)}")
        {:error, reason}
    end
  end

  defp port, do: Hexerei.Env.get!(:port)
end

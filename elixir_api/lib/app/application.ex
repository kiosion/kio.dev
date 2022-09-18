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
      }
    ]

    CliSpinners.spin_fun([frames: :simple_dots_scrolling, text: "Starting Hexerei", done: "Started Hexerei"], fn ->
      :timer.sleep(1000)
      {:ok, _pid} = Supervisor.start_link(children, [strategy: :one_for_one, name: Hexerei.Supervisor])
      end
    )
  end
end

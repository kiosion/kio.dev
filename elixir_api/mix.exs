defmodule Hexerei.MixProject do
  use Mix.Project

  def project do
    [
      app: :hexerei,
      version: "0.1.0",
      elixir: "~> 1.13",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      escript: [main_module: Hexerei.MixProject]
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Hexerei.Application, []}
    ]
  end

  defp deps do
    [
      {:plug_cowboy, "~> 2.5"},
      {:poison, "~> 3.1"},
      {:httpoison, "~> 1.8"},
      {:cli_spinners, "~> 0.1.0"}
    ]
  end
end

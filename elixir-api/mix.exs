defmodule Hexerei.MixProject do
  use Mix.Project

  def project do
    [
      app: :hexerei,
      version: "0.3.0",
      elixir: "~> 1.13",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      escript: escript(),
      releases: releases()
    ]
  end

  def application do
    [
      extra_applications: [
        :logger,
        :runtime_tools,
        :os_mon
      ],
      mod: {
        Hexerei.Application,
        []
      }
    ]
  end

  defp escript do
    [
      main_module: Hexerei.MixProject
    ]
  end

  defp releases do
    [
      hexerei: [
        include_executables_for: [:unix],
        steps: [:assemble, :tar],
        validate_compile_env: false
      ]
    ]
  end

  defp deps do
    [
      {:exsync, "~> 0.2", only: :dev},
      {:ex_doc, "~> 0.14", only: :dev, runtime: false},
      {:file_system, "~> 0.2", only: :dev},
      {:httpoison, "~> 1.8"},
      {:jose, "~> 1.10.1"},
      {:mox, "~> 1.0", only: :test},
      {:plug_cowboy, "~> 2.5"},
      {:poison, "~> 3.1"},
      {:ssl_verify_fun, "~> 1.1.7", manager: :rebar3, override: true}
    ]
  end
end

defmodule Hexerei.MixProject do
  use Mix.Project

  @lr_enabled System.get_env("LIVE_RELOAD", "false") == "true"

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
      extra_applications: case @lr_enabled do
        true ->
          [
            :logger,
            :runtime_tools,
            :os_mon
          ]
        _ ->
          [
            :logger,
            :os_mon
          ]
      end,
      mod: {
        Hexerei.Application, []
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
    case @lr_enabled do
      true ->
        [
          {:plug_cowboy, "~> 2.5"},
          {:poison, "~> 3.1"},
          {:httpoison, "~> 1.8"},
          {:cli_spinners, "~> 0.1.0"},
          {:jose, "~> 1.10.1"},
          {:exsync, "~> 0.2"},
          {:file_system, "~> 0.2"}
        ]
      _ ->
        [
          {:plug_cowboy, "~> 2.5"},
          {:poison, "~> 3.1"},
          {:httpoison, "~> 1.8"},
          {:cli_spinners, "~> 0.1.0"},
          {:jose, "~> 1.10.1"}
        ]
    end
  end
end

ExUnit.configure(trace: true)
ExUnit.start(capture_log: true)

Code.require_file("support/mocks.exs", __DIR__)
Code.require_file("support/fixtures.exs", __DIR__)

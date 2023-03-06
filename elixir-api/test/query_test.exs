defmodule QueryTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @opts Hexerei.Router.init([])

  # Filler test for now
  test "Filler" do
    assert true
  end
end

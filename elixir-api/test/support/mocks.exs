defmodule TestMocks do
  Mox.defmock(Hexerei.HTTP.MockClient, for: Hexerei.HTTP.Client)
end

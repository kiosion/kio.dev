defmodule Hexerei.HTTP.DefaultClient do
  @behaviour Hexerei.HTTP.Client

  def get(url, headers), do: HTTPoison.get(url, headers)
  def get(url), do: HTTPoison.get(url)

  def post(url, body, headers), do: HTTPoison.post(url, body, headers)
end

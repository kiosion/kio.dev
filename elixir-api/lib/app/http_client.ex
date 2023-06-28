defmodule Hexerei.HTTP.Client do
  @callback get(String.t(), headers :: list()) ::
              {:ok, HTTPoison.Response.t()} | {:error, HTTPoison.Error.t()}
  @callback get(String.t()) ::
              {:ok, HTTPoison.Response.t()} | {:error, HTTPoison.Error.t()}
  @callback post(String.t(), body :: map(), headers :: list()) ::
              {:ok, HTTPoison.Response.t()} | {:error, HTTPoison.Error.t()}
end

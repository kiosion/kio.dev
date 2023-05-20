defmodule Router.Api.Base do
  @moduledoc """
  Base router imports / macros for all API requests
  """

  defmacro __using__(opts \\ []) do
    auth = Keyword.get opts, :auth, false
    qp = Keyword.get opts, :query_params, true

    quote do
      use Plug.Router
      use Plug.ErrorHandler

      use Hexerei.Response
      use Hexerei.Utils
      use Hexerei.SanityClient.Utils

      require Logger

      alias Hexerei.SanityClient, as: Sanity
      alias Hexerei.SanityClient.Query, as: Query
      alias Hexerei.Translate

      plug :match

      if unquote(auth) do
        plug Hexerei.Plug.VerifyRequest
      end

      if unquote(qp) do
        plug :fetch_query_params
      end

      plug :dispatch

      unquote(opts)
    end
  end
end

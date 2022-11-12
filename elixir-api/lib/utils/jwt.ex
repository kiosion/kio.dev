defmodule Hexerei.JWT do
  @moduledoc """
  JSON Web Token implementation & helpers
  """

  # This is undefined for now
  @jwt_secret Application.compile_env(:hexerei, :jwt_secret)
  # Expiration time is 48 hours
  @jwt_exp 172800

  def provision do
    jwk = %{
      "kty" => "oct",
      "k" => encode_secret()
    }

    jws = %{
      "alg" => "HS256"
    }

    jwt = %{
      "iss" => "hexerei",
      "exp" => DateTime.utc_now() |> DateTime.add(@jwt_exp) |> DateTime.to_unix(),
      "iat" => DateTime.utc_now() |> DateTime.to_unix(),
      "scope" => "rwx"
    }

    {_, token} = JOSE.JWT.sign(jwk, jws, jwt) |> JOSE.JWS.compact()

    token
  end

  def get_claim(%JOSE.JWT{fields: fields} = _jwt_claims, key) do
    %{^key => value} = fields
    value
  end

  def verify_signature(token) do
    jwk = %{
      "kty" => "oct",
      "k" => encode_secret()
    }

    case JOSE.JWT.verify(jwk, token) do
      {true, claims, _} -> {:ok, claims}
      _ -> {:error, "Token signature could not be verified"}
    end
  end

  def verify_claims(%JOSE.JWT{fields: fields} = claims) do
    with %{"exp" => exp} = fields,
        {:ok, expiration_as_datetime} = DateTime.from_unix(exp),
        :gt <- DateTime.compare(expiration_as_datetime, DateTime.utc_now()) do
      {:ok, claims}
    else
      _ -> {:error, "Token has expired"}
    end
  end

  defp encode_secret() do
    @jwt_secret |> :jose_base64url.encode()
  end
end

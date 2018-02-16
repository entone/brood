defmodule Brood.Resource.Data.Router do
  use PlugRest.Router
  use Plug.ErrorHandler
  alias Brood.Resource.Data
  require Logger

  plug CORSPlug, origin: ["http://localhost:8080", "http://localhost:8090"], headers: ["authorization", "content-type"]
  plug Plug.Parsers, parsers: [:json], json_decoder: Poison
  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.LoadResource
  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__
  plug :match
  plug :dispatch

  resource "/:kit/:aggregator/:measurement/:tag/:value/:from/:to/:bucket", Data.Query
  resource "/:kit/:aggregator/:measurement/:tag/:value/:from/:to", Data.Query
  resource "/:kit/:aggregator/:measurement/:from/:to/:bucket", Data.Query
  resource "/:kit/:aggregator/:measurement/:from/:to", Data.Query

  def unauthenticated(conn, params) do
    Logger.error "Unauthenticated: #{inspect conn}"
    Logger.error "Unauthenticated: #{inspect params}"
    conn |> send_error(401, "{\"error\": \"Unauthorized\"}")
  end

  def handle_errors(conn, other) do
    Logger.error("#{inspect other}")
    send_error(conn, 500, "{\"error\": \"Ruh Roh!\"}")
  end

  def send_error(conn, status, data) do
    conn
    |> Plug.Conn.put_resp_content_type("application/json")
    |> send_resp(status, data)
  end

end

defmodule Brood.Resource.Account.AddKit do
  use PlugRest.Resource
  use Plug.Builder
  alias Brood.Resource.Account
  alias Brood.Resource.Account.Router
  require Logger

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.LoadResource
  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__
  plug :rest

  def allowed_methods(conn, state) do
    {["POST"], conn, state}
  end

  def content_types_accepted(conn, state) do
    {[{{"application", "x-www-form-urlencoded", :*}, :from_form}, {{"multipart", "form-data", :*}, :from_form}], conn, state}
  end

  def unauthenticated(conn, params) do
    Logger.error "Unauthenticated: #{inspect conn}"
    Logger.error "Unauthenticated: #{inspect params}"
    conn |> Router.send_error(401, "{\"error\": \"Unauthorized\"}")
  end

  def from_form(conn, state) do
    Logger.info "Adding Kit"
    account = Guardian.Plug.current_resource(conn)
    Logger.info "Account: #{inspect account}"
    kit =
      %Account.Kit{
        id: Map.get(conn.params, "kit_id"),
        name: Map.get(conn.params, "location_name")
      }
    Logger.info "Account: #{inspect kit}"
    account =
      %Account{account | kits: [kit | account.kits]}
      |> Account.update()
      |> Account.get_kits()

    Logger.info "Account: #{inspect account}"
    conn
    |> Router.sign(account)
    |> Router.response_body(account |> Account.cleanse)
    |> Router.respond(state)
  end
end

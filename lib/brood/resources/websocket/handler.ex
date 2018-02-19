defmodule Brood.Resource.WebSocket.Handler do
  require Logger
  alias Brood.Resource.Account
  @behaviour :cowboy_websocket_handler
  @timeout 45_000

  #Message Types
  @bearer "Bearer "
  @authentication "AUTHENTICATION"
  @ping "ping"
  @configure_touchstone "configure_touchstone"
  @configuration_state "configuration_state"
  @touchstone_name "touchstone_name"
  @touchstone_saved "touchstone_saved"
  @pong "pong"

  defmodule Message do
    @derive [Poison.Encoder]
    defstruct _type: :message,
      id: nil,
      type: nil,
      payload: nil
  end

  defmodule Error do
    @derive [Poison.Encoder]
    defstruct _type: :error, id: nil, message: nil
  end

  defmodule State do
    defstruct [authenticated: false, node: nil, account: nil, kit_id: nil]
  end

  def init(_, _req, _opts) do
    {:upgrade, :protocol, :cowboy_websocket}
  end

  def websocket_init(_type, req, _opts) do
    req1 = :cowboy_req.set_resp_header("access-control-allow-methods", "GET, OPTIONS", req)
    req2 = :cowboy_req.set_resp_header("access-control-allow-origin", "http://localhost:8080", req1)
    req2 = :cowboy_req.set_resp_header("access-control-allow-origin", "http://localhost:8090", req1)
    {:ok, req2, %State{}, @timeout}
  end

  def websocket_handle({:text, <<@bearer, token :: binary>>}, req, state) do
    Logger.debug("#{inspect token}")
    {reply, state} =
      case Guardian.decode_and_verify(token) do
        {:ok, claims} ->
          Logger.info "Claims: #{inspect claims}"
          account =
            claims
            |> Map.get("sub")
            |> (fn "Account:" <> id -> id end).()
            |> Account.from_id
            |> Account.cleanse
            |> IO.inspect
          Process.send_after(self(), :init_client, 100)
          kit_id = get_current_kit(account)
          {:ok, node} = start_node_communicator(kit_id)
          state = %State{state | authenticated: true, account: account, node: node, kit_id: kit_id}
          {%Message{type: @authentication, payload: state}, state}
        {:error, reason} ->
          Process.send_after(self(), :shutdown, 100)
          {%Error{message: :invalid_token}, state}
      end
      {:reply, {:text, reply |> Poison.encode!}, req, state}
  end

  def get_current_kit(account) do
    (Map.get(account, :kits) |> Enum.at(0)) |> Map.get(:id)
  end

  def start_node_communicator(kit_id) do
    node =
      case Brood.NodeCommunicator.start(kit_id) do
        {:ok, node} -> node
        {:error, {:already_started, node}} -> node
      end
      Brood.NodeCommunicator.register_handler(node, self())
      {:ok, node}
  end

  def websocket_handle({:text, "ping"}, req, %State{authenticated: true} = state) do
    {:reply, {:text, "pong"}, req, state}
  end

  def websocket_handle(_m, req, %State{authenticated: false} = state) do
    Process.send_after(self(), :shutdown, 0)
    {:reply, {:text, %Error{message: :not_authenticated} |> Poison.encode!}, req, state}
  end

  def websocket_handle({:text, payload}, req, %State{authenticated: true} = state) do
    Logger.debug("#{inspect payload}")
    {reply, state} = payload |> handle_payload(state)
    Logger.debug("#{inspect reply}")
    {:reply, {:text, reply |> Poison.encode!}, req, state}
  end

  def handle_payload(payload, state) do
    case Poison.decode(payload, as: %Message{}) do
      {:ok, mes} ->
        Logger.info("Got Message #{inspect mes}")
        mes |> handle_message(state)
      {:error, er} -> {%Error{message: er}, state}
    end
  end

  def handle_message(%Message{type: @ping} = mes, state) do
    {%Message{mes | type: @pong, payload: %{ok: :yes}}, state}
  end

  def handle_message(%Message{type: "actuator"} = message, state) do
    state.node |> Brood.NodeCommunicator.request(message)
    {%Message{message | payload: %{success: true}}, state}
  end

  def handle_message(%Message{type: "time_change"} = message, state) do
    Logger.info("Time Change: #{inspect message}")
    state.node |> Brood.NodeCommunicator.time_change(message)
    {%Message{message | payload: %{success: true}}, state}
  end

  def handle_message(%Message{type: "setpoint_change"} = message, state) do
    Logger.info("Setpoint Change: #{inspect message}")
    state.node |> Brood.NodeCommunicator.setpoint_change(message)
    {%Message{message | payload: %{success: true}}, state}
  end

  def handle_message(%Message{type: "CHANGE_KIT"} = message, state) do
    Logger.info("Updating KIT: #{inspect message}")
    Brood.NodeCommunicator.unregister_handler(state.node, self())
    :timer.sleep(1000)
    {:ok, node} = start_node_communicator("#{message.payload}")
    Process.send_after(self(), :init_client, 100) 
    state = %State{state | node: node}
    {%Message{message | payload: %{success: true}}, state}
  end

  def handle_message(%Message{} = mes, state) do
    {%Message{mes | type: :unknown_type, payload: %{type: mes.type}}, state}
  end

  def websocket_info(:shutdown, req, state) do
    {:shutdown, req, state}
  end

  def websocket_info({:point, message}, req, state) do
    dp = message |> Map.drop([:device_pid, :histogram, :timer])
    {:reply, {:text, message |> Poison.encode!}, req, state}
  end

  def websocket_info(:init_client, req, state) do
    settings = state.node |> Brood.NodeCommunicator.settings()
    mes = %Message{type: "CHANNEL_SETTINGS", payload: settings}
    {:reply, {:text, mes |> Poison.encode!}, req, state}
  end

  def websocket_info({:image, message}, req, state) do
    {:reply, {:binary, message}, req, state}
  end

  def websocket_info({:channel_settings, message}, req, state) do
    Logger.info "WS Sending Settings: #{inspect message}"
    {:reply, {:text, message}, req, state}
  end

  def websocket_terminate(_reason, req, state) do
    case state.node do
      nil -> nil
      _ -> Brood.NodeCommunicator.unregister_handler(state.node, self())
    end
    :ok
  end
end

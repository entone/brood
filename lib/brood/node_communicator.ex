defmodule Brood.NodeCommunicator do
  use GenMQTT
  require Logger
  alias Brood.Resource.WebSocket.Handler.Message
  alias Brood.Resource.Account

  @host Application.get_env(:brood, :mqtt_host)
  @port Application.get_env(:brood, :mqtt_port)

  @client_closed  "client_closed"
  @client_open  "client_open"

  @end_points ["request", "response", "point", "image", "channel_settings"]

  @kit_collection Application.get_env(:brood, :kit_collection)

  defmodule State do
    defstruct [:id, :name, :settings, handlers: [], open_handler: nil]
  end

  def register_handler(mod, pid) do
    GenMQTT.cast(mod, {:register, pid})
  end

  def unregister_handler(mod, pid) do
    GenMQTT.cast(mod, {:unregister, pid})
  end

  def settings(mod) do
    GenMQTT.call(mod, :settings)
  end

  def time_change(mod, %Message{} = message) do
    GenMQTT.cast(mod, {:time_change, message})
  end

  def setpoint_change(mod, %Message{} = message) do
    GenMQTT.cast(mod, {:setpoint_change, message})
  end

  def start(node_id, state \\ %State{}) do
    client = "Server:#{node_id}"
    Logger.info "MQTT Client #{client} Connecting: #{@host}:#{@port}"
    ssl_path = Application.get_env(:brood, :ssl_path)
    transport = {:ssl, [{:certfile, "#{ssl_path}/endless_summer.crt"}, {:keyfile, "#{ssl_path}/endless_summer.key"}]}
    GenMQTT.start(__MODULE__, %State{id: node_id}, transport: transport, client: client, host: @host, port: @port, name: String.to_atom(client))
  end

  def request(id, payload), do: GenMQTT.call(id, {:request, payload})

  def on_connect(state) do
    Logger.info "MQTT Connected"
    topics = @end_points |> Enum.map(fn ep ->
      {"node/#{state.id}/#{ep}", 1}
    end)
    :ok = GenMQTT.subscribe(self(), topics)
    kit = :mongo_brood |> Mongo.find_one(@kit_collection, %{id: state.id}, pool: DBConnection.Poolboy)
    oh = Process.send_after(self(), :open, 0)
    {:ok, %State{state | open_handler: oh, name: Map.get(kit, "name"), settings: Map.get(kit, "settings", %{})}}
  end

  def on_subscribe(_subscriptions, state) do
    {:ok, state}
  end

  def on_publish(["node", client, "response"], message, %State{id: id} = state) when client == id do
    Logger.info "#{client} Response Received: #{inspect message}"
    {:ok, state}
  end

  def on_publish(["node", client, "request"], message, %State{id: id} = state) when client == id do
    Logger.info "#{client} Request Sent: #{inspect message}"
    {:ok, state}
  end

  def on_publish(["node", client, "point"], message, %State{id: id} = state) when client == id do
    Logger.debug "#{client} Data Point Received: #{inspect message}"
    broadcast(state.handlers, {:point, message |> Poison.decode!})
    {:ok, state}
  end

  def on_publish(["node", client, "image"], message, %State{id: id} = state) when client == id do
    #Logger.debug "#{client} Image Received: #{inspect message}"
    broadcast(state.handlers, {:image, message})
    {:ok, state}
  end

  def on_publish(["node", client, "channel_settings"], message, %State{id: id} = state) when client == id do
    Logger.debug "#{client} Channel Settings Received: #{inspect message}"
    broadcast(state.handlers, {:channel_settings, message})
    {:ok, state}
  end

  def on_publish(_, _, state) do
    {:ok, state}
  end

  def broadcast(handlers, message) do
    handlers |> Enum.each(fn pid -> send(pid, message) end)
  end

  def handle_info(:open, state) do
    do_request(self(), state.id, %Message{type: @client_open})
    oh = Process.send_after(self(), :open, 5000)
    {:noreply, %State{state | open_handler: oh}}
  end

  def handle_info(:close, state) do
    Process.exit(self(), :normal)
    {:noreply, state}
  end

  def handle_call(:settings, _from, state), do: {:reply, state.settings, state}

  def handle_call({:request, payload}, _from, state) do
    do_request(self(), state.id, payload)
    {:reply, :ok, state}
  end

  def handle_cast({:register, pid}, state) do
    {:noreply, %State{state | handlers: [pid | state.handlers] }}
  end

  def handle_cast({:unregister, pid}, state) do
    Logger.info "Unregister: #{inspect state}"
    handlers =
      case List.delete(state.handlers, pid) do
        [] ->
          Process.cancel_timer(state.open_handler)
          do_request(self(), state.id, %Message{type: @client_closed})
          Process.send_after(self(), :close, 100)
          []
        list -> list
      end
    {:noreply, %State{state | handlers: handlers}}
  end

  def handle_cast({:time_change, %Message{} = message}, state) do
    Logger.info("Time Change: #{inspect message}")
    id = message.id
    st = message.payload |> Map.get("start")
    rt = message.payload |> Map.get("run_time")
    do_request(self(), state.id, message)
    settings = %{"#{id}_start": st, "#{id}_run_time": rt}
    update_settings(state.id, settings)
    {:noreply, %State{state | settings: state.settings |> Map.merge(settings)}}
  end

  def handle_cast({:setpoint_change, %Message{} = message}, state) do
    id = message.id
    val = message.payload |> Map.get("value")
    settings = %{"#{id}_setpoint": val}
    do_request(self(), state.id, message)
    update_settings(state.id, settings)
    {:noreply, %State{state | settings: state.settings |> Map.merge(settings)}}
  end

  def update_settings(id, setting, value) do
    update_settings(id, %{} |> Map.put(setting, value))
  end
  def update_settings(id, settings) when settings |> is_map do
    settings = settings |> Enum.reduce(%{}, fn {k, v}, acc -> acc |> Map.put("settings.#{k}", v) end)
    Logger.info "Updating Settings: #{inspect settings} for kit: #{inspect id}"
    :mongo_brood |> Mongo.update_one(@kit_collection, %{id: id}, %{"$set": settings}, pool: DBConnection.Poolboy)
  end

  def do_request(pid, id, payload) do
    topic = "node/#{id}/request"
    Logger.info "Node Request:#{topic} => #{inspect payload}"
    pid |> GenMQTT.publish(topic, payload |> Poison.encode!, 1)
  end
end

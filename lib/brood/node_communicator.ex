defmodule Brood.NodeCommunicator do
  use GenMQTT
  require Logger
  alias Brood.Resource.WebSocket.Handler.Message

  @host Application.get_env(:brood, :mqtt_host)
  @port Application.get_env(:brood, :mqtt_port)

  @client_closed  "client_closed"
  @client_open  "client_open"

  @end_points ["request", "response", "point", "image", "channel_settings"]

  defmodule State do
    defstruct [:id, handlers: [], open_handler: nil]
  end

  def register_handler(mod, pid) do
    GenMQTT.cast(mod, {:register, pid})
  end

  def unregister_handler(mod, pid) do
    GenMQTT.cast(mod, {:unregister, pid})
  end

  def start(node_id, state \\ %State{}) do
    client = "Server:#{node_id}"
    Logger.info "MQTT Client #{client} Connecting: #{@host}:#{@port}"
    priv_dir = :code.priv_dir(:brood)
    transport = {:ssl, [{:certfile, "#{priv_dir}/ssl/endless_summer.crt"}, {:keyfile, "#{priv_dir}/ssl/endless_summer.key"}]}
    GenMQTT.start(__MODULE__, %State{id: node_id}, transport: transport, client: client, host: @host, port: @port, name: String.to_atom(client))
  end

  def request(id, payload), do: GenMQTT.call(id, {:request, payload})

  def on_connect(state) do
    Logger.info "MQTT Connected"
    topics = @end_points |> Enum.map(fn ep ->
      {"node/#{state.id}/#{ep}", 1}
    end)
    :ok = GenMQTT.subscribe(self(), topics)
    oh = Process.send_after(self(), :open, 0)
    {:ok, %State{state | open_handler: oh}}
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
          Process.send_after(self(), :close, 1000)
          []
        list -> list
      end
    {:noreply, %State{state | handlers: handlers}}
  end

  def handle_call({:request, payload}, _from, state) do
    do_request(self(), state.id, payload)
    {:reply, :ok, state}
  end

  def do_request(pid, id, payload) do
    topic = "node/#{id}/request"
    Logger.info "Node Request:#{topic} => #{inspect payload}"
    pid |> GenMQTT.publish(topic, payload |> Poison.encode!, 1)
  end
end

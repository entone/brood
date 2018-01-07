defmodule Brood.MQTTHandler do
  use GenMQTT
  alias Brood.SatoriPublisher
  require Logger

  @host Application.get_env(:brood, :mqtt_host)
  @port Application.get_env(:brood, :mqtt_port)

  def start_link do
    client = Node.self |> Atom.to_string
    Logger.info "MQTT Client #{client} Connecting: #{@host}:#{@port}"
    priv_dir = :code.priv_dir(:brood)
    transport = {:ssl, [{:certfile, "#{priv_dir}/ssl/endless_summer.crt"}, {:keyfile, "#{priv_dir}/ssl/endless_summer.key"}]}
    GenMQTT.start_link(__MODULE__, nil, host: @host, port: @port, name: __MODULE__, client: client, transport: transport)
  end

  def on_connect(state) do
    Logger.info "MQTT Connected"
    :ok = GenMQTT.subscribe(self, "node/+/payload", 0)
    {:ok, state}
  end

  def on_publish(["node", client, "payload"], message, state) do
    Logger.info "#{client} Published Data"
    Task.Supervisor.start_child(Brood.TaskSupervisor, fn -> {client, message} |> process end)
    {:ok, state}
  end

  def on_publish(_, _, state) do
    {:ok, state}
  end

  def process({client, data}) do
    data
    |> parse(client)
    |> meta
    |> write
  end

  def parse(data, client) do
    timestamp = :os.system_time(:nano_seconds)
    data
    |> Poison.decode!
    |> Map.get("data")
    |> Enum.flat_map(fn {k,v} ->
      case v do
        v when v |> is_map() ->
          v |> Enum.map(fn {ki, vi} ->
            %{measurement: "#{k}.#{ki}", value: vi} |> create_measurement(timestamp, client)
          end)
        v -> [%{measurement: "#{k}", value: v} |> create_measurement(timestamp, client)]
      end
    end)
  end

  def create_measurement(sensor, timestamp, client) do
    %{
      measurement: "#{sensor.measurement}",
      timestamp: timestamp,
      fields: %{
        value: case sensor.value do
          num when num |> is_number -> num / 1
          text -> text
        end
      },
      tags: %{
        node_id: client,
        zipcode: nil,
      }
    }
  end

  def meta(points) do
    #TODO lookup zipcode/climate zone
    zip = "60626"
    points |> Enum.map(fn p ->
      %{p | tags: %{p.tags | zipcode: zip}} #dummy data
    end)
  end

  def write(points) do
    Logger.info "#{inspect points}"
    points |> Brood.DB.InfluxDB.write_points
  end

end

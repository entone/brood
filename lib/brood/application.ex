defmodule Brood.Application do
  use Application
  alias Brood.Resource.Account
  require Logger

  @mongo_database Application.get_env(:brood, :mongo_database)
  @mongo_host Application.get_env(:brood, :mongo_host)
  #@account_collection Application.get_env(:brood, :account_collection)

  def start(_type, _args) do
    import Supervisor.Spec, warn: false
    http_port = (Application.get_env(:brood, :http_port) || "8080") |> String.to_integer()
    children = [
      Brood.DB.InfluxDB.child_spec,
      supervisor(Task.Supervisor, [[name: Brood.TaskSupervisor]]),
      worker(Mongo, [[name: :mongo_brood, hostname: @mongo_host, database: @mongo_database, pool: DBConnection.Poolboy]]),
      worker(Brood.WebWorker, []),
      worker(Brood.MQTTHandler, []),
      worker(Brood.Scheduler, [])
    ]
    opts = [strategy: :one_for_one, name: Brood.Supervisor]
    Supervisor.start_link(children, opts) |> create_influx_db |> create_mongo_db
  end

  def create_influx_db({:ok, _pid} = result) do
    Brood.DB.InfluxDB.wait_till_up
    Brood.DB.InfluxDB.create_database
    Brood.DB.InfluxDB.create_retention_policies
    Brood.DB.InfluxDB.create_continuous_queries
    result
  end

  def create_mongo_db({:ok, _pid} = result) do
    Account.index()
    result
  end

  defp dispatch do
    [
      {:_, [
        {"/", Brood.Resource.UI.Index, []},
        {"/realtime", Brood.Resource.UI.Index, []},
        {"/historic", Brood.Resource.UI.Index, []},
        {"/control", Brood.Resource.UI.Index, []},
        {"/camera", Brood.Resource.UI.Index, []},
        {"/settings", Brood.Resource.UI.Index, []},
        {"/account", Brood.Resource.UI.Index, []},
        {"/login", Brood.Resource.UI.Index, []},
        {"/register", Brood.Resource.UI.Index, []},
        {"/ws", Brood.Resource.WebSocket.Handler, []},
        {"/video.mjpeg", Brood.Resource.UI.Streamer, []},
        {"/static/[...]", :cowboy_static, {:priv_dir,  :brood, "static"}},
        {"/build/[...]", :cowboy_static, {:priv_dir,  :brood, "ui/build"}},
        {:_, Plug.Adapters.Cowboy.Handler, {Brood.HTTPRouter, []}}
      ]}
    ]
  end
end

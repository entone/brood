use Mix.Config
require Logger

Logger.info "#{Mix.env}.exs"
config :brood,
  influx_database: "brood",
  mongo_host: "mongodb",
  mongo_database: "brood",
  mqtt_host: "vernemq",
  mqtt_port: 4883,
  http_port: System.get_env("INTERFACE_PORT"),
  account_collection: "accounts"

config :brood, Brood.DB.InfluxDB,
  host:      "influxdb",
  pool:      [ max_overflow: 10, size: 5 ],
  port:      8086,
  scheme:    "http",
  writer:    Instream.Writer.Line

config :guardian, Guardian,
  allowed_algos: ["HS512"],
  verify_module: Guardian.JWT,
  issuer: "Brood",
  ttl: { 30, :days },
  allowed_drift: 2000,
  verify_issuer: true,
  secret_key: {Brood.Resource.Account.SecretKey, :fetch},
  serializer: Brood.Resource.Account.GuardianSerializer

import_config "#{Mix.env}.exs"
import_config "keys.exs"

use Mix.Config

config :brood,
  mongo_host: "localhost",
  mqtt_host: "localhost",
  ssl_path: "/app/brood/priv/ssl"

config :brood, Brood.DB.InfluxDB,
  host: "localhost"

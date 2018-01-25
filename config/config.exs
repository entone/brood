use Mix.Config
require Logger

Logger.info "#{Mix.env}.exs"
config :brood,
  influx_database: "brood",
  mongo_host: "mongodb",
  mongo_database: "brood",
  mqtt_host: "vernemq",
  mqtt_port: 4883,
  http_port: System.get_env("HTTP_PORT") || "8080",
  https_port: System.get_env("HTTPS_PORT") || "8443",
  ssl_path: "/etc/ssl/brood",
  account_collection: "accounts",
  acme_server: "https://acme-v01.api.letsencrypt.org",
  acme_registration: System.get_env("ACME_REGISTRATION"),
  domain_name: System.get_env("DOMAIN"),
  cert_subject: %{
    common_name: System.get_env("DOMAIN"),
    organization_name: "Harvest2o",
    organizational_unit: "R&D",
    locality_name: "Chicago",
    state_or_province: "Illinois",
    country_name: "US"
  }

config :brood, Brood.Scheduler,
  jobs: [
    #Run at 6AM and 6PM, twice a day as Let's Encrypt recommends
    {"0 6,18 * * *", fn ->
      Logger.info "Running SSL Renewal"
      System.cmd("mix", ["generate_ssl_certs"])
    end}
  ]


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

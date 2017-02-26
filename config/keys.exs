use Mix.Config
config :brood, keys: %{
  weather: %{
    tags: ["id"],
    values: [
      ["outdoor_temperature"],
      ["indoor_temperature"],
      ["humidity"],
      ["pressure"],
      ["wind", "speed"],
      ["wind", "direction"],
      ["wind", "gust"],
      ["rain"],
      ["uv"],
      ["solar", "radiation"],
      ["solar", "intensity"],
    ]
  },
  energy: %{
    tags: ["id"],
    values: [
      ["price"],
      ["kw_delivered"],
      ["kw_received"],
      ["kw"]
    ]
  },
  ieq: %{
    tags: ["id"],
    values: [
      ["battery"],
      ["co2"],
      ["energy"],
      ["pressure"],
      ["humidity"],
      ["light"],
      ["no2"],
      ["co"],
      ["pm"],
      ["rssi"],
      ["sound"],
      ["temperature"],
      ["uv"],
      ["voc"],
      ["door"]
    ]
  },
  hvac: %{
    tags: ["id"],
    values: [
      ["state"],
      ["mode"],
      ["fan_mode"],
      ["fan_state"],
      ["target_temperature"],
      ["temperature"]
    ]
  }
}

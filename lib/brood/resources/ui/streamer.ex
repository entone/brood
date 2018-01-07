defmodule Brood.Resource.UI.Streamer do
  @boundary "w58EW1cEpjzydSCq"

  def init({:tcp, :http}, req, _opts) do
    headers = [
      {"cache-control", "no-cache, private"},
      {"content-type", "multipart/x-mixed-replace; boundary=#{@boundary}"},
      {"pragma", "no-cache"},
      {"Access-Control-Allow-Origin", "*"},
    ]
    {ok, req2} = :cowboy_req.chunked_reply(200, headers, req)
    Process.send_after(self(), :handle, 0)
    {:loop, req2, %{}}
  end

  def info(:handle, req, state), do: send_image(req)

  def send_image(req) do
    jpg = Hardware.Camera.image()
    size = byte_size(jpg)
    header = "------#{@boundary}\r\nContent-Type: image/jpeg\r\nContent-length: #{size}\r\n\r\n"
    footer = "\r\n"
    :cowboy_req.chunk(header, req)
    :cowboy_req.chunk(jpg, req)
    :cowboy_req.chunk(footer, req)
    send_image(req)
  end

end

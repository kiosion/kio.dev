---
layout: post
title: Mixing WebSockets & HTTP endpoints in Elixir with Cowboy + Plug
date: 2023-07-30
tags: [elixir, websockets]
desc:
  Using a custom dispatcher structure for mixing HTTP and WebSocket endpoints in
  a simple Plug-based Elixir API
---

Howdy! 🤠

I recently found myself wanting to add a WebSocket endpoint to an existing
Plug-based Elixir API I'd built with Cowboy. It seemed like a straightforward
task, but I found pretty sparse information online about it. After a weekend
spent looking through Hexdocs & Cowboy's documentation, I figured I'd write a
short post about my solution.

My reason for using Cowboy in the first place comes partly from stubbornness.
Frameworks like Phoenix offer useful abstractions and utilities, but I prefer
the lightweight & more minimalist approach provided by libraries like Cowboy. I
find it gives more granular control over request handling, and is nicer to work
with for smaller-scale applications.

## Creating a Custom Dispatcher Structure

Assuming your application follows the typical Elixir structure, we need to
define a custom dispatcher structure for the Cowboy child spec in your
supervision tree. This dispatcher structure is used for designating a separate
module for handling any WebSocket requests we get, keeping that handling
separate from any HTTP routes.

```elixir
defmodule MyApplication do
  use Application

  defp dispatcher do
    [
      {:_, [
        {"/websocket", MyApplication.SocketRouter, []},
        {:_, Plug.Cowboy.Handler, {MyApplication.Router, []}},
      ]}
    ]
  end

  @impl true
  def start _type, _args do
    children = [
      {
        Plug.Cowboy,
        scheme: :http,
        plug: MyApplication.Router,
        options: [
          port: 3000,
          dispatch: dispatcher,
        ],
      }
    ]

    opts = [strategy: :one_for_one, name: __MODULE__]

    Supervisor.start_link children, opts
  end
end
```

In this minimal example, we define a dispatcher structure that routes requests
starting with "/websocket" to the `SocketRouter` module, while `Router` handles
all other paths. Since the order is hierarchical, the WebSocket route comes
first, followed by the `:_` catch-all atom for any others.

## Stub HTTP Router

For the purpose of this writeup, we'll use a super minimal HTTP router module
that simply responds with "Hello, world" to any request:

```elixir
defmodule MyApplication.Router do
  use Plug.Router

  plug :match
  plug :dispatch

  match _ do
    send_resp conn, 200, "Hello, world!"
  end
end
```

## WebSocket Handler

```elixir
defmodule MyApplication.SocketRouter do
  @behaviour :cowboy_websocket_handler

  def init req, _opts do
    {
      :cowboy_websocket,
      req,
      %{},
      %{
        # 1 min w/o a ping from the client and the connection is closed
        idle_timeout: 60_000,
        # Max incoming frame size of 1 MB
        max_frame_size: 1_000_000,
      }
    }
  end

  def websocket_init state \\ %{} do
    {:ok, state}
  end

  # Handle 'ping' frames
  def websocket_handle {:text, "ping"}, req, state do
    {:reply, {:text, "pong"}, req, state}
  end

  # Ignore all other text frames
  def websocket_handle {:text, _msg}, req, state do
    {:ok, req, state}
  end

  def websocket_info msg, req, state do
    {:reply, {:text, msg}, req, state}
  end

  def terminate _reason, _req, _state do
    :ok
  end
end
```

Here, we specify that the module conforms to the `:cowboy_websocket_handler`
behaviour using `@behaviour`. This consists of a few callbacks:

- `init/2` initializes the WebSocket handler and specifies any options (in this
  case, just overriding the default `idle_timeout` and `max_frame_size`).
- `websocket_init/1` initializes the specific WebSocket connection and sets up
  the initial state.
- `websocket_handle/3` handles specific WebSocket frames, such as responding to
  `:ping` frames with a `:text` response of "pong".
- `websocket_info/3` handles any Elixir messages recieved from other parts of
  the application, and forwards them to the WebSocket client.
- `terminate/3` is called upon termination and allows performing cleanup tasks
  such as terminating other processes.

## Profit (?)

With the demo app running locally, we can see these endpoints in action! First
up, the HTTP router:

```sh
$ curl -i http://localhost:3000
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 13

Hello, world!
```

And next, the WebSocket router:

```sh
$ wscat -c ws://localhost:3000/websocket
Connected (press CTRL+C to quit)
```

Once connected, sending a text frame of "ping" yields a response of "pong", as
expected:

```sh
> ping
< pong
```

So there you have it! I hope this quick overview is useful; I've personally
loved working with Cowboy so far and am glad I was able to make it work for this
use-case of mine 😁

## More resources

The full docs for cowboy_websocket are worth a read:

- https://ninenines.eu/docs/en/cowboy/2.7/manual/cowboy_websocket/

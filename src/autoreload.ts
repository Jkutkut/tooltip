const connectWebSocket = (reconnect) => {
  const ws = "ws://localhost:3000";
  const RECONNECT_DELAY = 1000;

  const socket = new WebSocket(ws);
  socket.addEventListener("open", () => {
    console.debug("Connected");
    if (reconnect) {
      console.debug("Reloading...");
      location.reload();
    }
  });
  socket.addEventListener("message", (event) => {
    if (event.data === "reload") {
      console.log("Reloading...");
      location.reload();
    }
  });
  socket.addEventListener("close", () => {
    setTimeout(() => connectWebSocket(true), RECONNECT_DELAY);
  });
};

connectWebSocket(false);

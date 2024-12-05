import { serve } from "bun";
import { watch } from "fs";

import { compile } from "./src/compile";

let sockets: WebSocket[] = [];

serve({
  port: 3000,
  fetch(req, server) {
    if (server.upgrade(req)) {
        return;
    }
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file("." + path);
    return new Response(file, {});
  },
  websocket: {
    open(ws) {
        sockets.push(ws);
    },
    close(ws) {
      sockets = sockets.filter(socket => socket !== ws);
    },
  },
  error(err) {
    if (err.code === "ENOENT") {
      return new Response("Internal Server Error", { status: 404 });
    }
    return new Response("Internal Server Error", { status: 500 });
  },
});

const reloadAllClients = () => {
    for (const socket of sockets) {
        socket.send("reload");
    }
};

const srcDir = import.meta.dirname + "/src";
const watchers = [
  watch(
    srcDir,
    { recursive: true },
    async (event, filename) => {
      if (!filename || !filename.endsWith(".ts")) {
        reloadAllClients();
        return;
      }
      console.log("File changed: " + filename);
      await compile();
      reloadAllClients();
    },
  ),
  watch(
    import.meta.dirname,
    { recursive: true },
    (event, filename) => {
      if (!filename || !filename.endsWith(".html")) {
        return;
      }
      console.log("File changed: " + filename);
      reloadAllClients();
    },
  ),
];

compile().then(() => {
  console.log("Tooltip server started");
})

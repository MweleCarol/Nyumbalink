import { env } from "./config/env";
import { createApp } from "./app";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`NyumbaLink API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Stop cleanly when you press Ctrl+C or a host shuts the process down.
function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// index.ts
import { serve } from "@hono/node-server";
import { app } from "./adapter/handler/router.js";

const port = Number(process.env.PORT || 8787);

serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 Server running at http://localhost:${port}`);

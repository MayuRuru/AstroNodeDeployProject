import leaderboard from "../db/leaderboard.json";
import { Hono } from "hono";

const app = new Hono();

export default app;

// Create our endpoints:
app.get("/", (ctx) => {
  return ctx.json([
    {
      endpoint: "/leaderboard",
      description: "Returns board information",
    },
  ]);
});

/* export default {
  async fetch(request, env, ctx) {
    return new Response(JSON.stringify(leaderboard), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  },
}; */

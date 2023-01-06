import leaderboard from "../db/leaderboard.json";

export default {
  async fetch(request, env, ctx) {
    return new Response(JSON.stringify(leaderboard), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  },
};

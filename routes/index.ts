import type { Express } from "express";

import auth from "./auth.ts";
import chat from "./chat.ts";
import watchlist from "./watchlist.ts";

export function registerRoutes(app: Express) {
  app.get("/api", (req, res) => {
    res.send("I'm a bored fish..");
  });

  app.use("/api", auth);
  app.use("/api", chat);
  app.use("/api", watchlist);
}

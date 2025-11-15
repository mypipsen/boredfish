import "dotenv/config";
import express from "express";
import { z } from "zod";

import { errorHandler } from "./middleware/errorHandler.ts";
import { validateSchema } from "./middleware/validate.ts";
import ChatAgent from "./agents/chatAgent.ts";

const chatAgent = new ChatAgent();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("I'm a bored fish..");
});

app.get(
  "/api/chat",
  validateSchema({
    query: z.object({
      q: z.string().min(1).max(512),
    }),
  }),
  async (req, res) => {
    console.info(req.url);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    return chatAgent.run(req.query.q as string, res);
  }
);

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

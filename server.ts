import "dotenv/config";
import express from "express";
import { z } from "zod";

import { errorHandler } from "./middleware/errorHandler.ts";
import { validateSchema } from "./middleware/validate.ts";
import OpenaiAgent from "./agents/openai.ts";
import OllamaAgent from "./agents/ollama.ts";

const openaiAgent = new OpenaiAgent();
const ollamaAgent = new OllamaAgent();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("I'm a bored fish..");
});

app.get("/api/ollama", async (req, res) => {
  console.info(req.url);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  return ollamaAgent.run(req.query.q as string, res);
});

app.get(
  "/api/openai",
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

    return openaiAgent.run(req.query.q as string, res);
  }
);

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

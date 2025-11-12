import "dotenv/config";
import express from "express";
import { z } from "zod";

import { errorHandler } from "./middleware/errorHandler.ts";
import { validateSchema } from "./middleware/validate.ts";
import SearchAgent from "./agents/search.ts";

const searchAgent = new SearchAgent();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("I'm a bored fish..");
});

app.get(
  "/api/search",
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

    const stream = await searchAgent.run(req.query.q as string);
    const textStream = stream.toTextStream({
      compatibleWithNodeStreams: false,
    });

    for await (const text of textStream) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    await stream.completed;
    res.write("event: end\ndata: done\n\n");
    res.end();
  }
);

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

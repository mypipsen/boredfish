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

app.get("/", (req, res) => {
  res.send("I'm a bored fish..");
});

app.get(
  "/search",
  validateSchema({
    query: z.object({
      q: z.string().min(1).max(512),
    }),
  }),
  async (req, res) => {
    return await searchAgent.run(req.query.q as string);
  }
);

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

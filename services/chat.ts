import type { Response } from "express";

import ChatAgent from "../agents/chatAgent.ts";

const chatAgent = new ChatAgent();

export async function chat(query: string, res: Response) {
  return chatAgent.run(query, res);
}

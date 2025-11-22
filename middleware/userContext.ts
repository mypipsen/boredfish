import assert from "assert";
import { AsyncLocalStorage } from "async_hooks";

import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";

import { auth } from "../services/auth.ts";

type Context = {
  userId?: string;
};

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export function userContext(req: Request, res: Response, next: NextFunction) {
  const store: Context = {};

  asyncLocalStorage.run(store, async () => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (session) {
        store.userId = session.user.id;
      }
    } catch (err) {
      console.error("Failed to get session:", err);
    }

    next();
  });
}

export function getCurrentUserId() {
  const store = asyncLocalStorage.getStore();
  assert(store && store.userId);
  return store.userId;
}

import { z, type ZodTypeAny } from "zod";
import type { Request, Response, NextFunction } from "express";

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export function validateSchema(schemas: Schemas) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      if (schemas.body) {
        const parsed = schemas.body.parse(req.body);
        // req.body = parsed;
      }

      if (schemas.query) {
        const parsed = schemas.query.parse(req.query);
        // req.query = parsed;
      }

      if (schemas.params) {
        const parsed = schemas.params.parse(req.params);
        // req.params = parsed;
      }

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.flatten() });
      }

      next(err);
    }
  };
}

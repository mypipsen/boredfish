import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./prisma.ts";

export function auth({ disableSignUp } = { disableSignUp: true }) {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp,
      minPasswordLength: 5,
    },
    trustedOrigins: ["http://localhost:8080"],
  });
}

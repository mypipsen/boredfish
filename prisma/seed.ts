import { prisma } from "./client.ts";
import { auth } from "../services/auth.ts";

async function main() {
  const defaultUser = {
    email: "admin@bored.fish",
    name: "admin",
    password: "admin",
  };

  const existing = await prisma.user.findUnique({
    where: { email: defaultUser.email },
  });

  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        email: defaultUser.email,
        name: defaultUser.name,
        password: defaultUser.password,
      },
    });

    console.log("Default user created:", defaultUser.email);
  } else {
    console.log("Default user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

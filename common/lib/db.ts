import { PrismaClient as MainPrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var mainPrisma: MainPrismaClient | undefined;
}

let mainPrisma: MainPrismaClient;

if (process.env.NODE_ENV === "production") {
  mainPrisma = new MainPrismaClient();
} else {
  if (!global.mainPrisma) {
    global.mainPrisma = new MainPrismaClient();
  }
  mainPrisma = global.mainPrisma;
}

export { mainPrisma };

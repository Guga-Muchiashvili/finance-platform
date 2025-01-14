import { PrismaClient as MainPrismaClient } from "@prisma/client";
import { PrismaClient as OtherPrismaClient } from "../../prisma/generated/other-client";

declare global {
  // eslint-disable-next-line no-var
  var mainPrisma: MainPrismaClient | undefined;
  // eslint-disable-next-line no-var
  var otherPrisma: OtherPrismaClient | undefined;
}

let mainPrisma: MainPrismaClient;
let otherPrisma: OtherPrismaClient;

if (process.env.NODE_ENV === "production") {
  mainPrisma = new MainPrismaClient();
  otherPrisma = new OtherPrismaClient();
} else {
  if (!global.mainPrisma) {
    global.mainPrisma = new MainPrismaClient();
  }
  mainPrisma = global.mainPrisma;

  if (!global.otherPrisma) {
    global.otherPrisma = new OtherPrismaClient();
  }
  otherPrisma = global.otherPrisma;
}

export { mainPrisma, otherPrisma };

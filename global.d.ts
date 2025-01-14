import { PrismaClient as MainPrismaClient } from "@prisma/client";
import { PrismaClient as OtherPrismaClient } from "./prisma/generated/other-client"; // Update the path if needed

declare global {
  namespace NodeJS {
    interface Global {
      mainPrisma?: MainPrismaClient;
      otherPrisma?: OtherPrismaClient;
    }
  }
}

export {};

"use server";
import { otherPrisma } from "../../common/lib/db";

export async function fetchTransactions() {
  try {
    const models = await otherPrisma.earning.findMany();
    return models;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

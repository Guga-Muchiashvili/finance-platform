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

export async function fetchWorkers() {
  try {
    const models = await otherPrisma.worker.findMany();
    return models;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

export async function fetchModelById(id: string) {
  try {
    const model = await otherPrisma.model.findUnique({
      where: {
        id,
      },
    });

    if (!model) {
      throw new Error(`Model with id ${id} not found.`);
    }

    return model;
  } catch (error) {
    console.error("Error fetching model:", error);
    throw error;
  }
}

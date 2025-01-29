"use server";
import { mainPrisma } from "../../common/lib/db";

export async function fetchTransactions() {
  try {
    const models = await mainPrisma.earning.findMany();
    return models;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

export async function fetchWorkers() {
  try {
    const models = await mainPrisma.worker.findMany();
    return models;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}
export async function fetchModels() {
  try {
    const models = await mainPrisma.model.findMany();
    return models;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

export async function fetchModelById(id: string) {
  try {
    const model = await mainPrisma.model.findUnique({
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
export async function fetchWorkerById(id: string) {
  try {
    const Worker = await mainPrisma.worker.findUnique({
      where: {
        id,
      },
    });

    if (!Worker) {
      throw new Error(`Worker with id ${id} not found.`);
    }

    return Worker;
  } catch (error) {
    console.error("Error fetching Worker:", error);
    throw error;
  }
}
export async function fetchTransactionById(id: string) {
  try {
    const Transaction = await mainPrisma.earning.findUnique({
      where: {
        id,
      },
    });

    if (!Transaction) {
      throw new Error(`Transaction with id ${id} not found.`);
    }

    return Transaction;
  } catch (error) {
    console.error("Error fetching Transaction:", error);
    throw error;
  }
}

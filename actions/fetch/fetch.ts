"use server";
import { IFormWorker, IWorker } from "@/common/types";
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
export async function fetchModels() {
  try {
    const models = await otherPrisma.model.findMany();
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
export async function fetchWorkerById(id: string) {
  try {
    const Worker = await otherPrisma.worker.findUnique({
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

export async function addWorker(data: IFormWorker): Promise<IWorker> {
  try {
    const newWorker = await otherPrisma.worker.create({
      data: { ...data },
    });

    await otherPrisma.model.update({
      where: { id: data.modelId },
      data: {
        workers: {
          push: newWorker.id,
        },
      },
    });

    return newWorker;
  } catch (error) {
    console.error("Error adding new worker:", error);
    throw error;
  }
}

export async function deleteWorker(id: string): Promise<void> {
  try {
    const workerToDelete = await otherPrisma.worker.findUnique({
      where: { id },
    });

    if (!workerToDelete) {
      throw new Error(`Worker with ID ${id} not found.`);
    }

    const modelToUpdate = await otherPrisma.model.findUnique({
      where: { id: workerToDelete.modelId },
      select: { workers: true },
    });

    if (!modelToUpdate) {
      throw new Error(`Model with ID ${workerToDelete.modelId} not found.`);
    }

    const updatedWorkers = modelToUpdate.workers.filter(
      (workerId) => workerId !== id
    );

    await otherPrisma.model.update({
      where: { id: workerToDelete.modelId },
      data: {
        workers: updatedWorkers,
      },
    });

    await otherPrisma.worker.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting worker:", error);
    throw error;
  }
}

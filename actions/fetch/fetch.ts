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

export async function fetchLeads() {
  try {
    const Leads = await mainPrisma.lead.findMany();
    return Leads;
  } catch (error) {
    console.error("Error fetching Leads:", error);
    throw error;
  }
}

export async function fetchLeadById(id: string) {
  try {
    const Lead = await mainPrisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!Lead) {
      throw new Error(`Lead with id ${id} not found.`);
    }

    return Lead;
  } catch (error) {
    console.error("Error fetching Lead:", error);
    throw error;
  }
}

export async function fetchSubscriptions() {
  try {
    const Leads = await mainPrisma.lead.findMany();
    return Leads;
  } catch (error) {
    console.error("Error fetching Leads:", error);
    throw error;
  }
}

export async function fetchSubscriptionById(id: string) {
  try {
    const Subscription = await mainPrisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!Subscription) {
      throw new Error(`Subscription with id ${id} not found.`);
    }

    return Subscription;
  } catch (error) {
    console.error("Error fetching Subscription:", error);
    throw error;
  }
}

// DISCORD FETCH REQUESTS

export async function fetchDiscordTransactions() {
  try {
    const DiscordTransactions = await mainPrisma.transactions.findMany();
    return DiscordTransactions;
  } catch (error) {
    console.error("Error fetching DiscordTransactions:", error);
    throw error;
  }
}

export async function fetchDiscordTransactionById(id: string) {
  try {
    const DiscordTransaction = await mainPrisma.transactions.findUnique({
      where: {
        id,
      },
    });

    if (!DiscordTransaction) {
      throw new Error(`DiscordTransaction with id ${id} not found.`);
    }

    return DiscordTransaction;
  } catch (error) {
    console.error("Error fetching DiscordTransaction:", error);
    throw error;
  }
}
export async function fetchDiscorWorkers() {
  try {
    const DiscordWorkers = await mainPrisma.discordWorkers.findMany();
    return DiscordWorkers;
  } catch (error) {
    console.error("Error fetching DiscordWorkers:", error);
    throw error;
  }
}

export async function FetchDiscordWorkersById(id: string) {
  try {
    const DiscordWorker = await mainPrisma.discordWorkers.findUnique({
      where: {
        id,
      },
    });

    if (!DiscordWorker) {
      throw new Error(`DiscordWorker with id ${id} not found.`);
    }

    return DiscordWorker;
  } catch (error) {
    console.error("Error fetching DiscordWorker:", error);
    throw error;
  }
}

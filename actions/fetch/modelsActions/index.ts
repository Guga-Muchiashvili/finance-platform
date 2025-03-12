"use server";
import {
  IEarning,
  IFormEarning,
  IFormLead,
  IFormModel,
  IFormTodo,
  IFormWorker,
  ITodo,
  Itransaction,
  IWorker,
} from "@/common/types";
import { mainPrisma } from "../../../common/lib/db";

export const getModelDashboardData = async () => {
  try {
    const [earnings, workers, models, leads, subscription, todos] =
      await Promise.all([
        mainPrisma.earning.findMany(),
        mainPrisma.worker.findMany(),
        mainPrisma.model.findMany(),
        mainPrisma.lead.findMany(),
        mainPrisma.subscription.findMany(),
        mainPrisma.todo.findMany(),
      ]);

    const moneyIn = earnings
      .reduce((sum, earning) => sum + parseFloat(earning.total), 0)
      .toFixed(1);

    const completedEarnings = earnings.filter(
      (earning) => earning.status.toLowerCase() === "completed"
    );

    const moneyOut = completedEarnings
      .reduce((sum, earning) => sum + parseFloat(earning.total), 0)
      .toFixed(1);

    const ourShare = earnings
      .reduce((sum, earning) => {
        return (
          sum +
          (parseFloat(earning.total) * (100 - parseFloat(earning.percentage))) /
            100
        );
      }, 0)
      .toFixed(1);

    const ourShareBroughtOut = completedEarnings
      .reduce((sum, earning) => {
        return (
          sum +
          (parseFloat(earning.total) * (100 - parseFloat(earning.percentage))) /
            100
        );
      }, 0)
      .toFixed(1);

    const monthlyTransactions: Record<string, number> = {};
    const transactionFees = earnings.map((earning) => {
      const transactionFee =
        parseFloat(String(earning.amount)) - parseFloat(earning.total);
      const date = new Date(earning.createdAt.split("/").reverse().join("-"));
      const monthKey = date
        .toLocaleString("en-US", { month: "long" })
        .toLowerCase();
      if (!monthlyTransactions[monthKey]) {
        monthlyTransactions[monthKey] = 0;
      }
      monthlyTransactions[monthKey] += parseFloat(earning.total);
      return transactionFee;
    });

    const totalTransactionFee = transactionFees
      .reduce((sum, fee) => sum + fee, 0)
      .toFixed(1);

    const allIntervals: string[] = [];
    const firstTransactionDate = new Date(
      Math.min(
        ...earnings.map((earning) =>
          new Date(earning.createdAt.split("/").reverse().join("-")).getTime()
        )
      )
    );

    const today = new Date();

    for (
      let date = new Date(firstTransactionDate);
      date <= today;
      date.setDate(date.getDate() + 14)
    ) {
      const endDate = new Date(date);
      endDate.setDate(date.getDate() + 13);
      const label = `${date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
      allIntervals.push(label);
    }

    const modelChartData = models.map((model) => {
      const modelEarnings = earnings.filter((e) => e.modelId === model.id);
      if (modelEarnings.length === 0) {
        return {
          label: model.name,
          data: new Array(allIntervals.length).fill(0),
        };
      }

      const groupedEarnings: Record<string, number> = {};

      modelEarnings.forEach((earning) => {
        const date = new Date(earning.createdAt.split("/").reverse().join("-"));
        const intervalIndex = Math.floor(
          (date.getTime() - firstTransactionDate.getTime()) /
            (14 * 24 * 60 * 60 * 1000)
        );

        if (!groupedEarnings[allIntervals[intervalIndex]]) {
          groupedEarnings[allIntervals[intervalIndex]] = 0;
        }
        groupedEarnings[allIntervals[intervalIndex]] += parseFloat(
          earning.total
        );
      });

      const data = allIntervals.map((interval) => {
        return (groupedEarnings[interval] || 0).toFixed(1);
      });

      return {
        label: model.name,
        data,
      };
    });

    const workerChartData = workers.map((worker) => {
      const workerEarnings = earnings.filter((e) => e.workerId === worker.id);
      if (workerEarnings.length === 0) {
        return {
          label: worker.name,
          data: new Array(allIntervals.length).fill(0),
        };
      }

      const groupedEarnings: Record<string, number> = {};

      workerEarnings.forEach((earning) => {
        const date = new Date(earning.createdAt.split("/").reverse().join("-"));
        const intervalIndex = Math.floor(
          (date.getTime() - firstTransactionDate.getTime()) /
            (14 * 24 * 60 * 60 * 1000)
        );

        if (!groupedEarnings[allIntervals[intervalIndex]]) {
          groupedEarnings[allIntervals[intervalIndex]] = 0;
        }
        groupedEarnings[allIntervals[intervalIndex]] += parseFloat(
          earning.total
        );
      });

      const data = allIntervals.map((interval) => {
        return (groupedEarnings[interval] || 0).toFixed(1);
      });

      return {
        label: worker.name,
        data,
      };
    });

    const modelTransaction = await Promise.all(
      models.map(async (model) => {
        const modelEarnings = await mainPrisma.earning.findMany({
          where: { modelId: model.id },
        });
        const totalEarnings = modelEarnings.reduce(
          (sum, earning) => sum + parseFloat(earning.total || "0"),
          0
        );

        return {
          label: model.name,
          value: totalEarnings.toFixed(1),
        };
      })
    );

    const workerTransaction = await Promise.all(
      workers.map(async (worker) => {
        const workerEarnings = await mainPrisma.earning.findMany({
          where: { workerId: worker.id },
        });
        const totalEarnings = workerEarnings.reduce(
          (sum, earning) => sum + parseFloat(earning.total || "0"),
          0
        );

        return {
          label: worker.name,
          value: totalEarnings.toFixed(1),
        };
      })
    );

    const transactionTotals = earnings.map((earning) =>
      parseFloat(earning.total)
    );

    const maxTransactionTotal = Math.max(...transactionTotals).toFixed(1);

    const averageTransactionTotal = (
      transactionTotals.reduce((sum, total) => sum + total, 0) /
      transactionTotals.length
    ).toFixed(1);

    function calculateStreak(transactions: IEarning[]) {
      if (!transactions.length) return 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const uniqueDates = Array.from(
        new Set(
          transactions.map((transaction) => {
            const [day, month, year] = transaction.createdAt
              .split("/")
              .map(Number);
            return new Date(year, month - 1, day).setHours(0, 0, 0, 0);
          })
        )
      ).sort((a, b) => b - a);

      if (uniqueDates[0] !== today.getTime()) {
        return 0;
      }

      let streak = 1;

      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const previousDate = new Date(uniqueDates[i + 1]);

        previousDate.setDate(previousDate.getDate() + 1);

        if (currentDate.getTime() === previousDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    }

    const streak = calculateStreak(earnings);

    const activeLeads = leads.filter((lead) => lead.active);
    const modelLeadCounts: Record<string, number> = {};

    activeLeads.forEach((lead) => {
      lead.modelId.forEach((modelId) => {
        if (!modelLeadCounts[modelId]) {
          modelLeadCounts[modelId] = 0;
        }
        modelLeadCounts[modelId]++;
      });
    });

    const leadChartData = models.map((model) => {
      return modelLeadCounts[model.id] || 0;
    });

    const Leadlabels = models.map((model) => model.name);
    const LeadchartData = leadChartData;

    const ModelSubscriptions = subscription.filter(
      (item) => item.type == "Model"
    );

    return {
      moneyIn,
      moneyOut,
      ourShare,
      ourShareBroughtOut,
      transactions: earnings,
      workers,
      models,
      modelChartData,
      workerChartData,
      monthlyTransactions,
      totalTransactionFee,
      Leadlabels,
      leads,
      todos,
      LeadchartData,
      subscription: ModelSubscriptions,
      ModelsPieData: modelTransaction,
      WorkersPieData: workerTransaction,
      moneyByMonth: Object.entries(monthlyTransactions).map(
        ([month, value]) => ({ label: month, value: value.toFixed(1) })
      ),
      maxTransactionTotal,
      averageTransactionTotal,
      streak: streak,
      chartLabels: allIntervals,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  } finally {
    await mainPrisma.$disconnect();
  }
};

export async function addModel(data: IFormModel): Promise<IFormModel> {
  try {
    const existingModel = await mainPrisma.model.findUnique({
      where: { name: data.name },
    });

    if (existingModel) {
      throw new Error(`A model with the name "${data.name}" already exists.`);
    }

    const newModel = await mainPrisma.model.create({
      data: { ...data },
    });

    return newModel;
  } catch (error) {
    console.error("Error adding new model:", error);
    throw error;
  }
}

export async function deleteModel(id: string): Promise<void> {
  try {
    const modelToDelete = await mainPrisma.model.findUnique({
      where: { id },
    });

    if (!modelToDelete) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    await mainPrisma.model.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting model:", error);
    throw error;
  }
}

export async function editModel(
  id: string,
  updatedData: IFormModel
): Promise<IFormModel> {
  try {
    const modelToEdit = await mainPrisma.model.findUnique({
      where: { id },
    });

    if (!modelToEdit) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    const updatedModel = await mainPrisma.model.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedModel;
  } catch (error) {
    console.error("Error editing model:", error);
    throw error;
  }
}

export async function editWorker(
  id: string,
  updatedData: IFormWorker
): Promise<IFormWorker> {
  try {
    const workerToEdit = await mainPrisma.worker.findUnique({
      where: { id },
    });

    if (!workerToEdit) {
      throw new Error(`Worker with ID ${id} not found.`);
    }

    const updatedWorker = await mainPrisma.worker.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedWorker;
  } catch (error) {
    console.error("Error editing worker:", error);
    throw error;
  }
}

export async function addWorker(data: IFormWorker): Promise<IWorker> {
  try {
    const newWorker = await mainPrisma.worker.create({
      data: { ...data, email: data.email || "", idNumber: data.idNumber || "" },
    });

    await mainPrisma.model.update({
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
    const workerToDelete = await mainPrisma.worker.findUnique({
      where: { id },
    });

    if (!workerToDelete) {
      throw new Error(`Worker with ID ${id} not found.`);
    }

    const modelToUpdate = await mainPrisma.model.findUnique({
      where: { id: workerToDelete.modelId },
      select: { workers: true },
    });

    if (!modelToUpdate) {
      throw new Error(`Model with ID ${workerToDelete.modelId} not found.`);
    }

    const updatedWorkers = modelToUpdate.workers.filter(
      (workerId) => workerId !== id
    );

    await mainPrisma.model.update({
      where: { id: workerToDelete.modelId },
      data: {
        workers: updatedWorkers,
      },
    });

    await mainPrisma.worker.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting worker:", error);
    throw error;
  }
}

export async function addTransaction(
  data: IFormEarning
): Promise<Itransaction> {
  try {
    const newTransaction = await mainPrisma.earning.create({
      data: { ...data },
    });

    await mainPrisma.worker.update({
      where: { id: data.workerId },
      data: {
        earnings: {
          push: newTransaction.id,
        },
      },
    });

    await mainPrisma.model.update({
      where: { id: data.modelId },
      data: {
        earnings: {
          push: newTransaction.id,
        },
      },
    });

    return newTransaction;
  } catch (error) {
    console.error("Error adding new transaction:", error);
    throw error;
  }
}
export const createLead = async ({
  name,
  img,
  modelId,
  workerId,
  active,
  seen,
  description,
}: IFormLead) => {
  try {
    const worker = await mainPrisma.worker.findFirst({
      where: { id: workerId },
    });

    if (!worker) {
      throw new Error("Worker not found");
    }

    const newLead = await mainPrisma.lead.create({
      data: {
        name,
        img,
        modelId,
        workerId: worker.id,
        active,
        seen,
        description,
        notes: JSON.stringify(""),
      },
    });

    return newLead;
  } catch (error) {
    console.error("Error creating lead:", error);
    throw new Error("Failed to create lead");
  }
};

export async function editLead(
  id: string,
  updatedData: IFormLead
): Promise<IFormLead> {
  try {
    const LeadToEdit = await mainPrisma.lead.findUnique({
      where: { id },
    });

    if (!LeadToEdit) {
      throw new Error(`Lead with ID ${id} not found.`);
    }

    const updatedLead = await mainPrisma.lead.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedLead;
  } catch (error) {
    console.error("Error editing Lead:", error);
    throw error;
  }
}

export async function editTransaction(
  id: string,
  updatedData: IFormEarning
): Promise<Itransaction> {
  try {
    const transactionToEdit = await mainPrisma.earning.findUnique({
      where: { id },
    });

    if (!transactionToEdit) {
      throw new Error(`Transaction with ID ${id} not found.`);
    }

    const updatedTransaction = await mainPrisma.earning.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedTransaction;
  } catch (error) {
    console.error("Error editing transaction:", error);
    throw error;
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    const transactionToDelete = await mainPrisma.earning.findUnique({
      where: { id },
    });

    if (!transactionToDelete) {
      throw new Error(`Transaction with ID ${id} not found.`);
    }

    await mainPrisma.earning.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}
export async function deleteLead(id: string): Promise<void> {
  try {
    const LeadToDelete = await mainPrisma.lead.findUnique({
      where: { id },
    });

    if (!LeadToDelete) {
      throw new Error(`Lead with ID ${id} not found.`);
    }

    await mainPrisma.lead.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting Lead:", error);
    throw error;
  }
}

export async function calculatePaymentsForAllWorkers(): Promise<
  {
    id: string;
    name: string;
    modelId: string;
    amountDue: string;
    totalSalaryPaid: string;
  }[]
> {
  try {
    const workers = await mainPrisma.worker.findMany();

    const earnings = await mainPrisma.earning.findMany({
      where: {
        status: { not: "completed" },
      },
    });

    const completedEarnings = await mainPrisma.earning.findMany({
      where: {
        status: "completed",
      },
    });

    const earningsByWorker: Record<string, typeof earnings> = {};
    earnings.forEach((earning) => {
      if (!earningsByWorker[earning.workerId]) {
        earningsByWorker[earning.workerId] = [];
      }
      earningsByWorker[earning.workerId].push(earning);
    });

    const completedEarningsByWorker: Record<string, typeof completedEarnings> =
      {};
    completedEarnings.forEach((earning) => {
      if (!completedEarningsByWorker[earning.workerId]) {
        completedEarningsByWorker[earning.workerId] = [];
      }
      completedEarningsByWorker[earning.workerId].push(earning);
    });

    const workerPayments = workers.map((worker) => {
      const workerEarnings = earningsByWorker[worker.id] || [];
      const completedWorkerEarnings =
        completedEarningsByWorker[worker.id] || [];

      const amountDue = workerEarnings.reduce((sum, earning) => {
        const transactionAmount = parseFloat(earning.total.toString());
        const percentage = Number(earning.percentage);

        if (isNaN(transactionAmount) || isNaN(percentage)) {
          console.warn(
            `Invalid earning data for worker ${worker.id}:`,
            earning
          );
          return sum;
        }

        return sum + (transactionAmount * Number(percentage - 3.5)) / 100;
      }, 0);

      const totalSalaryPaid = completedWorkerEarnings.reduce((sum, earning) => {
        const percentage = Number(earning.percentage);

        const transactionAmount = parseFloat(earning.total.toString());
        if (isNaN(transactionAmount)) {
          console.warn(
            `Invalid completed earning data for worker ${worker.id}:`,
            earning
          );
          return sum;
        }
        return sum + (transactionAmount * Number(percentage - 3.5)) / 100;
      }, 0);

      return {
        id: worker.id,
        name: worker.name,
        modelId: worker.modelId,
        amountDue: amountDue.toFixed(1),
        totalSalaryPaid: totalSalaryPaid.toFixed(1),
      };
    });

    return workerPayments;
  } catch (error) {
    console.error("Error calculating worker payments:", error);
    throw error;
  }
}

export async function editTodo(
  id: string,
  updatedData: IFormTodo
): Promise<IFormTodo> {
  try {
    const TodoToEdit = await mainPrisma.todo.findUnique({
      where: { id },
    });

    if (!TodoToEdit) {
      throw new Error(`Todo with ID ${id} not found.`);
    }

    const updatedTodo = await mainPrisma.todo.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedTodo;
  } catch (error) {
    console.error("Error editing Todo:", error);
    throw error;
  }
}

export async function addTodo(data: IFormTodo): Promise<ITodo> {
  try {
    const newTodo = await mainPrisma.todo.create({
      data: {
        ...data,
        description: data.description ?? "",
        deadline: data.deadline ?? "",
        label: data.label ?? "",
      },
    });

    return newTodo;
  } catch (error) {
    console.error("Error adding new Todo:", error);
    throw error;
  }
}

export async function deleteTodo(id: string): Promise<void> {
  try {
    const TodoToDelete = await mainPrisma.todo.findUnique({
      where: { id },
    });

    if (!TodoToDelete) {
      throw new Error(`Todo with ID ${id} not found.`);
    }
    await mainPrisma.todo.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting Todo:", error);
    throw error;
  }
}

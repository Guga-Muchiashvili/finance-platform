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

    const parseCreatedAt = (v: unknown): Date | null => {
      if (!v) return null;
      if (v instanceof Date && !isNaN(v.getTime())) return v;
      const s = String(v);

      if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
      }

      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
        const [dayStr, monthStr, yearStr] = s.split("/");
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);
        const d = new Date(year, month - 1, day);
        return isNaN(d.getTime()) ? null : d;
      }

      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    };

    const moneyIn = earnings
      .reduce((sum, earning) => sum + parseFloat(earning.total || "0"), 0)
      .toFixed(1);

    const completedEarnings = earnings.filter(
      (earning) => String(earning.status || "").toLowerCase() === "completed"
    );

    const moneyOut = completedEarnings
      .reduce((sum, earning) => sum + parseFloat(earning.total || "0"), 0)
      .toFixed(1);

    const ourShare = earnings
      .reduce((sum, earning) => {
        const total = parseFloat(earning.total || "0");
        const perc = parseFloat(earning.percentage || "0");
        return sum + (total * (100 - perc)) / 100;
      }, 0)
      .toFixed(1);

    const ourShareBroughtOut = completedEarnings
      .reduce((sum, earning) => {
        const total = parseFloat(earning.total || "0");
        const perc = parseFloat(earning.percentage || "0");
        return sum + (total * (100 - perc)) / 100;
      }, 0)
      .toFixed(1);

    const monthlyTotals: Record<string, number> = {};
    const validDates: number[] = [];

    const transactionFees = earnings.map((earning) => {
      const amount = parseFloat(String(earning.amount || "0"));
      const total = parseFloat(earning.total || "0");
      const date = parseCreatedAt(earning.createdAt);
      if (date) {
        validDates.push(date.getTime());
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        monthlyTotals[key] = (monthlyTotals[key] || 0) + total;
      }
      return amount - total;
    });

    const totalTransactionFee = transactionFees
      .reduce((sum, fee) => sum + (isFinite(fee) ? fee : 0), 0)
      .toFixed(1);

    let moneyByMonth: { label: string; value: string }[] = [];
    let firstTransactionDate: Date | null = null;

    if (validDates.length > 0) {
      firstTransactionDate = new Date(Math.min(...validDates));
      const lastTransactionDate = new Date(Math.max(...validDates));

      const startMonth = new Date(
        firstTransactionDate.getFullYear(),
        firstTransactionDate.getMonth(),
        1
      );

      const today = new Date();
      const lastOrToday =
        today.getTime() > lastTransactionDate.getTime()
          ? today
          : lastTransactionDate;

      const endMonth = new Date(
        lastOrToday.getFullYear(),
        lastOrToday.getMonth(),
        1
      );

      const out: { label: string; value: string }[] = [];
      for (
        let d = new Date(startMonth);
        d <= endMonth;
        d.setMonth(d.getMonth() + 1)
      ) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        const label = `${d
          .toLocaleString("en-US", { month: "long" })
          .toLowerCase()} ${d.getFullYear()}`;
        const val = monthlyTotals[key] || 0;
        out.push({ label, value: val.toFixed(1) });
      }
      moneyByMonth = out;
    }
    const allIntervals: string[] = [];
    const today = new Date();
    const startForIntervals =
      firstTransactionDate ??
      new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (
      let date = new Date(startForIntervals);
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
      const grouped: Record<string, number> = {};
      modelEarnings.forEach((earning) => {
        const date = parseCreatedAt(earning.createdAt);
        if (!date || !firstTransactionDate) return;
        const intervalIndex = Math.floor(
          (date.getTime() - firstTransactionDate.getTime()) /
            (14 * 24 * 60 * 60 * 1000)
        );
        const bucket = allIntervals[intervalIndex];
        if (!bucket) return;
        grouped[bucket] =
          (grouped[bucket] || 0) + parseFloat(earning.total || "0");
      });
      const data = allIntervals.map((int) => (grouped[int] || 0).toFixed(1));
      return { label: model.name, data };
    });

    const workerChartData = workers.map((worker) => {
      const workerEarnings = earnings.filter((e) => e.workerId === worker.id);
      if (workerEarnings.length === 0) {
        return {
          label: worker.name,
          data: new Array(allIntervals.length).fill(0),
        };
      }
      const grouped: Record<string, number> = {};
      workerEarnings.forEach((earning) => {
        const date = parseCreatedAt(earning.createdAt);
        if (!date || !firstTransactionDate) return;
        const intervalIndex = Math.floor(
          (date.getTime() - firstTransactionDate.getTime()) /
            (14 * 24 * 60 * 60 * 1000)
        );
        const bucket = allIntervals[intervalIndex];
        if (!bucket) return;
        grouped[bucket] =
          (grouped[bucket] || 0) + parseFloat(earning.total || "0");
      });
      const data = allIntervals.map((int) => (grouped[int] || 0).toFixed(1));
      return { label: worker.name, data };
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
        return { label: model.name, value: totalEarnings.toFixed(1) };
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
        return { label: worker.name, value: totalEarnings.toFixed(1) };
      })
    );

    const transactionTotals = earnings.map((e) => parseFloat(e.total || "0"));
    const maxTransactionTotal = transactionTotals.length
      ? Math.max(...transactionTotals).toFixed(1)
      : "0.0";
    const averageTransactionTotal = transactionTotals.length
      ? (
          transactionTotals.reduce((s, t) => s + t, 0) /
          transactionTotals.length
        ).toFixed(1)
      : "0.0";

    function calculateStreak(transactions: IEarning[]) {
      if (!transactions.length) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const uniqueDates = Array.from(
        new Set(
          transactions.map((tx) => {
            const d = parseCreatedAt(tx.createdAt);
            if (!d) return NaN;
            return new Date(
              d.getFullYear(),
              d.getMonth(),
              d.getDate()
            ).getTime();
          })
        )
      )
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => b - a);

      if (!uniqueDates.length || uniqueDates[0] !== today.getTime()) return 0;

      let streak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const cur = new Date(uniqueDates[i]);
        const prev = new Date(uniqueDates[i + 1]);
        prev.setDate(prev.getDate() + 1);
        if (cur.getTime() === prev.getTime()) streak++;
        else break;
      }
      return streak;
    }

    const streak = calculateStreak(earnings);

    const activeLeads = leads.filter((lead) => lead.active);
    const modelLeadCounts: Record<string, number> = {};
    activeLeads.forEach((lead) => {
      lead.modelId.forEach((modelId) => {
        if (!modelLeadCounts[modelId]) modelLeadCounts[modelId] = 0;
        modelLeadCounts[modelId]++;
      });
    });

    const Leadlabels = models.map((m) => m.name);
    const LeadchartData = models.map((m) => modelLeadCounts[m.id] || 0);

    const ModelSubscriptions = subscription.filter(
      (item) => item.type === "Model"
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
      monthlyTransactions: monthlyTotals,
      totalTransactionFee,
      Leadlabels,
      leads,
      todos,
      LeadchartData,
      subscription: ModelSubscriptions,
      ModelsPieData: modelTransaction,
      WorkersPieData: workerTransaction,
      moneyByMonth,
      maxTransactionTotal,
      averageTransactionTotal,
      streak,
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
      data: {
        ...data,
        email: data.email || "",
        idNumber: data.idNumber || "",
      },
    });

    await mainPrisma.model.update({
      where: { id: data.modelId },
      data: {
        workers: {
          push: newWorker.id,
        },
      },
    });

    await mainPrisma.percentages
      .create({
        data: {
          workerId: newWorker.id,
          percentage: 40,
        },
      })
      .catch((err) => {
        if (!err.message.includes("Unique constraint failed")) {
          console.error("Error creating default percentage:", err);
          throw err;
        }
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
    holdTransactions: string;
    balanceTransactions: string;
  }[]
> {
  try {
    const workers = await mainPrisma.worker.findMany({
      where: { active: true },
    });
    const [earnings, completedEarnings, transactions] = await Promise.all([
      mainPrisma.earning.findMany({ where: { status: { not: "completed" } } }),
      mainPrisma.earning.findMany({ where: { status: "completed" } }),
      mainPrisma.earning.findMany(),
    ]);

    const earningsByWorker: Record<string, typeof earnings> = {};
    const completedEarningsByWorker: Record<string, typeof completedEarnings> =
      {};
    const transactionsByWorker: Record<string, typeof transactions> = {};

    for (const earning of earnings) {
      (earningsByWorker[earning.workerId] ??= []).push(earning);
    }

    for (const earning of completedEarnings) {
      (completedEarningsByWorker[earning.workerId] ??= []).push(earning);
    }

    for (const tx of transactions) {
      (transactionsByWorker[tx.workerId] ??= []).push(tx);
    }

    const workerPayments = workers.map((worker) => {
      const workerEarnings = earningsByWorker[worker.id] || [];
      const completedWorkerEarnings =
        completedEarningsByWorker[worker.id] || [];
      const workerTransactions = transactionsByWorker[worker.id] || [];

      const amountDue = workerEarnings.reduce((sum, earning) => {
        const total = parseFloat(earning.total);
        const percentage = Number(earning.percentage);
        return isNaN(total) || isNaN(percentage)
          ? sum
          : sum + (total * (percentage - 4.5)) / 100;
      }, 0);

      const totalSalaryPaid = completedWorkerEarnings.reduce((sum, earning) => {
        const total = parseFloat(earning.total);
        const percentage = Number(earning.percentage);
        return isNaN(total) || isNaN(percentage)
          ? sum
          : sum + (total * (percentage - 4.5)) / 100;
      }, 0);

      const holdTransactions = workerTransactions
        .filter((tx) => tx.status.toLowerCase() === "hold")
        .reduce((sum, tx) => {
          const total = parseFloat(tx.total);
          return isNaN(total)
            ? sum
            : sum + (total * (Number(tx.percentage) - 4.5)) / 100;
        }, 0);

      const balanceTransactions = workerTransactions
        .filter((tx) => tx.status.toLowerCase() === "balance")
        .reduce((sum, tx) => {
          const total = parseFloat(tx.total);
          return isNaN(total)
            ? sum
            : sum + (total * (Number(tx.percentage) - 4.5)) / 100;
        }, 0);

      return {
        id: worker.id,
        name: worker.name,
        modelId: worker.modelId,
        amountDue: amountDue.toFixed(1),
        totalSalaryPaid: totalSalaryPaid.toFixed(1),
        holdTransactions: holdTransactions.toFixed(1),
        balanceTransactions: balanceTransactions.toFixed(1),
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

export async function getWorkerPercentages() {
  await syncPercentagesWithWorkers();

  const workers = await mainPrisma.worker.findMany({ where: { active: true } });
  const percentages = await mainPrisma.percentages.findMany();

  return percentages
    .filter((p) => workers.some((w) => w.id === p.workerId))
    .map((p) => ({
      ...p,
      workerName: workers.find((w) => w.id === p.workerId)?.name || "Unknown",
    }));
}

export async function updateWorkerPercentage({
  id,
  percentage,
}: {
  id: string;
  percentage: number;
}) {
  const updated = await mainPrisma.percentages.update({
    where: { id },
    data: { percentage },
  });

  return updated;
}

export async function syncPercentagesWithWorkers(defaultPercentage = 40) {
  const allWorkers = await mainPrisma.worker.findMany();
  const existing = await mainPrisma.percentages.findMany();

  const existingWorkerIds = new Set(existing.map((p) => p.workerId));
  const currentWorkerIds = new Set(allWorkers.map((w) => w.id));

  const missing = allWorkers.filter(
    (worker) => !existingWorkerIds.has(worker.id)
  );
  for (const worker of missing) {
    await mainPrisma.percentages.create({
      data: {
        workerId: worker.id,
        percentage: defaultPercentage,
      },
    });
  }

  const orphaned = existing.filter((p) => !currentWorkerIds.has(p.workerId));
  for (const orphan of orphaned) {
    await mainPrisma.percentages.delete({ where: { id: orphan.id } });
  }

  return {
    created: missing.length,
    deleted: orphaned.length,
  };
}

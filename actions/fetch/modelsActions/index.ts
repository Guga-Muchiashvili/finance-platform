"use server";
import { IFormModel, IFormWorker } from "@/common/types";
import { otherPrisma } from "../../../common/lib/db";

export const getModelDashboardData = async () => {
  try {
    const [earnings, workers, models] = await Promise.all([
      otherPrisma.earning.findMany(),
      otherPrisma.worker.findMany(),
      otherPrisma.model.findMany(),
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
        const percentage = parseFloat(earning.percentage);
        return sum + parseFloat(earning.total) * (1 - percentage / 100);
      }, 0)
      .toFixed(1);

    const ourShareBroughtOut = completedEarnings
      .reduce((sum, earning) => {
        const percentage = parseFloat(earning.percentage);
        return sum + parseFloat(earning.total) * (1 - percentage / 100);
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
        const modelEarnings = await otherPrisma.earning.findMany({
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
        const workerEarnings = await otherPrisma.earning.findMany({
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

    const transactionDates = earnings
      .map((earning) =>
        new Date(
          earning.createdAt.split("/").reverse().join("-")
        ).toDateString()
      )
      .sort();

    let streak = 1;
    let currentStreak = 1;
    for (let i = 1; i < transactionDates.length; i++) {
      if (
        new Date(transactionDates[i]).getTime() -
          new Date(transactionDates[i - 1]).getTime() ===
        86400000
      ) {
        currentStreak++;
      } else {
        streak = Math.max(streak, currentStreak);
        currentStreak = 1;
      }
    }
    streak = Math.max(streak, currentStreak);

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
      ModelsPieData: modelTransaction,
      WorkersPieData: workerTransaction,
      moneyByMonth: Object.entries(monthlyTransactions).map(
        ([month, value]) => ({ label: month, value: value.toFixed(1) })
      ),
      maxTransactionTotal,
      averageTransactionTotal,
      streak,
      chartLabels: allIntervals,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  } finally {
    await otherPrisma.$disconnect();
  }
};

export async function addModel(data: IFormModel): Promise<IFormModel> {
  try {
    const existingModel = await otherPrisma.model.findUnique({
      where: { name: data.name },
    });

    if (existingModel) {
      throw new Error(`A model with the name "${data.name}" already exists.`);
    }

    const newModel = await otherPrisma.model.create({
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
    const modelToDelete = await otherPrisma.model.findUnique({
      where: { id },
    });

    if (!modelToDelete) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    await otherPrisma.model.delete({
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
    const modelToEdit = await otherPrisma.model.findUnique({
      where: { id },
    });

    if (!modelToEdit) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    const updatedModel = await otherPrisma.model.update({
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
    const workerToEdit = await otherPrisma.worker.findUnique({
      where: { id },
    });

    if (!workerToEdit) {
      throw new Error(`Worker with ID ${id} not found.`);
    }

    const updatedWorker = await otherPrisma.worker.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedWorker;
  } catch (error) {
    console.error("Error editing worker:", error);
    throw error;
  }
}

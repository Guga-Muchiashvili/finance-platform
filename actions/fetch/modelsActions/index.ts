"use server";
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
    earnings.forEach((earning) => {
      const date = new Date(earning.createdAt.split("/").reverse().join("-"));
      let key;
      const interval = determineInterval(date);
      if (interval === "monthly") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else if (interval === "biweekly") {
        key = `${date.getFullYear()}-W${Math.floor(date.getDate() / 14) + 1}`;
      } else {
        key = earning.createdAt;
      }
      if (!allIntervals.includes(key)) {
        allIntervals.push(key);
      }
    });

    allIntervals.sort();

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
        let key;
        const interval = determineInterval(date);
        if (interval === "monthly") {
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        } else if (interval === "biweekly") {
          key = `${date.getFullYear()}-W${Math.floor(date.getDate() / 14) + 1}`;
        } else {
          key = earning.createdAt;
        }

        if (!groupedEarnings[key]) {
          groupedEarnings[key] = 0;
        }
        groupedEarnings[key] += parseFloat(earning.total);
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
        let key;
        const interval = determineInterval(date);
        if (interval === "monthly") {
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        } else if (interval === "biweekly") {
          key = `${date.getFullYear()}-W${Math.floor(date.getDate() / 14) + 1}`;
        } else {
          key = earning.createdAt;
        }

        if (!groupedEarnings[key]) {
          groupedEarnings[key] = 0;
        }
        groupedEarnings[key] += parseFloat(earning.total);
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
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  } finally {
    await otherPrisma.$disconnect();
  }
};

function determineInterval(date: Date): "monthly" | "biweekly" | "daily" {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  if (daysDiff < 30) {
    return "daily";
  } else if (daysDiff < 365) {
    return "biweekly";
  } else {
    return "monthly";
  }
}

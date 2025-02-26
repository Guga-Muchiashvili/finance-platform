"use server";
import {
  IDiscordEarning,
  IDiscordWorker,
  IFormDiscordEarning,
  IFormDiscordWorker,
} from "@/common/types";
import { mainPrisma } from "../../../common/lib/db";

export async function getDiscordDashboardData() {
  const transactions = await mainPrisma.transactions.findMany();
  const Subscriptions = await mainPrisma.subscription.findMany();
  const DiscordWorkers = await mainPrisma.discordWorkers.findMany();

  let totalIn = 0;
  let totalOut = 0;
  let ourShareTotal = 0;
  let ourShareOut = 0;
  let totalFee = 0;
  let biggestTransaction = 0;
  const monthlyData: { [key: string]: number } = {};

  transactions.forEach((tx) => {
    const total = parseFloat(tx.total);
    const amount = tx.amount;
    const percentage = parseFloat(tx.percentage);

    const [, month, year] = tx.createdAt.split("/").map(Number);
    const monthKey = `${month}/${year}`;

    if (!isNaN(total) && !isNaN(amount) && !isNaN(percentage)) {
      const ourShare = total * (1 - percentage / 100);
      const fee = amount - total;

      totalIn += total;
      ourShareTotal += ourShare;
      totalFee += fee;

      if (tx.status === "Completed") {
        totalOut += total;
        ourShareOut += ourShare;
      }

      if (total > biggestTransaction) {
        biggestTransaction = total;
      }

      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + total;
    }
  });

  const averageTransactionAmount = Number(
    transactions.length > 0
      ? transactions.reduce((sum, tx) => sum + tx.amount, 0) /
          transactions.length
      : 0
  ).toFixed(1);

  const firstTransactionDate = transactions.length
    ? transactions
        .map((tx) => {
          const [day, month, year] = tx.createdAt.split("/").map(Number);
          return new Date(year, month - 1, day);
        })
        .sort((a, b) => a.getTime() - b.getTime())[0]
    : new Date();

  const today = new Date();
  const allMonths: string[] = [];
  const MonthChartData: number[] = [];

  const currentDate = new Date(firstTransactionDate);
  while (currentDate <= today) {
    const key = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    allMonths.push(key);
    MonthChartData.push(monthlyData[key] || 0);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const discordTransactionData: { [key: string]: number } = {};
  const firstSunday = new Date(firstTransactionDate);
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

  transactions.forEach((tx) => {
    const [day, month, year] = tx.createdAt.split("/").map(Number);
    const dateKey = new Date(year, month - 1, day);

    const diff = Math.floor(
      (dateKey.getTime() - firstSunday.getTime()) / (14 * 24 * 60 * 60 * 1000)
    );
    const weekStart = new Date(firstSunday);
    weekStart.setDate(weekStart.getDate() + diff * 14);

    const key = `${weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${new Date(
      weekStart.getTime() + 13 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;

    discordTransactionData[key] =
      (discordTransactionData[key] || 0) + parseFloat(tx.total);
  });

  const allWeeks: string[] = [];
  const chartData: number[] = [];
  const currentWeek = new Date(firstSunday);

  while (currentWeek <= today) {
    const key = `${currentWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${new Date(
      currentWeek.getTime() + 13 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;

    allWeeks.push(key);
    chartData.push(discordTransactionData[key] || 0);

    currentWeek.setDate(currentWeek.getDate() + 14);
  }

  const DiscordSubstiptions = Subscriptions.filter(
    (item) => item.type == "Discord"
  );

  function calculateStreak(transactions: IDiscordEarning[]) {
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

  const streak = calculateStreak(transactions);
  return {
    totalIn,
    totalOut,
    streak,
    ourShareTotal,
    ourShareOut,
    totalFee: totalFee.toFixed(1),
    averageTransactionAmount,
    biggestTransaction,
    transactions,
    months: allMonths,
    MonthChartData,
    workers: DiscordWorkers,
    DiscordSubstiptions,
    dataLineChart: {
      labels: allWeeks,
      data: chartData,
    },
  };
}

export async function editDiscordWorker(
  id: string,
  updatedData: IFormDiscordWorker
): Promise<IFormDiscordWorker> {
  try {
    const workerToEdit = await mainPrisma.discordWorkers.findUnique({
      where: { id },
    });

    if (!workerToEdit) {
      throw new Error(`Worker with ID ${id} not found.`);
    }

    const updatedWorker = await mainPrisma.discordWorkers.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedWorker;
  } catch (error) {
    console.error("Error editing worker:", error);
    throw error;
  }
}

export async function addDiscordWorker(
  data: IFormDiscordWorker
): Promise<IDiscordWorker> {
  try {
    const newWorker = await mainPrisma.discordWorkers.create({
      data: { ...data },
    });

    return newWorker;
  } catch (error) {
    console.error("Error adding new worker:", error);
    throw error;
  }
}

export async function deletDiscordeWorker(id: string): Promise<void> {
  try {
    const workerToDelete = await mainPrisma.discordWorkers.findUnique({
      where: { id },
    });

    if (!workerToDelete) {
      throw new Error(`Worker with ID ${id} not found.`);
    }

    await mainPrisma.discordWorkers.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting worker:", error);
    throw error;
  }
}

export async function editDiscordTransaction(
  id: string,
  updatedData: IFormDiscordEarning
): Promise<IDiscordEarning> {
  try {
    const transactionToEdit = await mainPrisma.transactions.findUnique({
      where: { id },
    });

    if (!transactionToEdit) {
      throw new Error(`Transaction with ID ${id} not found.`);
    }

    const updatedTransaction = await mainPrisma.transactions.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedTransaction;
  } catch (error) {
    console.error("Error editing transaction:", error);
    throw error;
  }
}

export async function deleteDiscordTransaction(id: string): Promise<void> {
  try {
    const transactionToDelete = await mainPrisma.transactions.findUnique({
      where: { id },
    });

    if (!transactionToDelete) {
      throw new Error(`Transaction with ID ${id} not found.`);
    }

    await mainPrisma.transactions.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}

export async function addDiscordTransaction(
  data: IFormDiscordEarning
): Promise<IDiscordEarning> {
  try {
    const newTransaction = await mainPrisma.transactions.create({
      data: { ...data },
    });

    await mainPrisma.discordWorkers.update({
      where: { id: data.workerId },
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

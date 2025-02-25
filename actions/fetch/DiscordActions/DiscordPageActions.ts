"use server";
import { mainPrisma } from "../../../common/lib/db";

export async function getDiscordDashboardData() {
  const transactions = await mainPrisma.transactions.findMany();
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
    const amount = parseFloat(tx.amount);
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
      ? transactions.reduce(
          (sum, tx) => sum + parseFloat(tx.amount || "0"),
          0
        ) / transactions.length
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
  return {
    totalIn,
    totalOut,
    ourShareTotal,
    ourShareOut,
    totalFee,
    averageTransactionAmount,
    biggestTransaction,
    transactions,
    months: allMonths,
    MonthChartData,
    workers: DiscordWorkers,
    dataLineChart: {
      labels: allWeeks,
      data: chartData,
    },
  };
}

"use server";
import { mainPrisma } from "../../../common/lib/db";

export async function getDiscordDashboardData() {
  const transactions = await mainPrisma.transactions.findMany();

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
          const [, month, year] = tx.createdAt.split("/").map(Number);
          return new Date(year, month - 1);
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
  };
}

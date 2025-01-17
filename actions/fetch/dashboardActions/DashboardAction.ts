"use server";
import { otherPrisma } from "../../../common/lib/db";
import { mainPrisma } from "../../../common/lib/db";

export async function fetchDashboardData() {
  try {
    console.log("here");
    const transactions = await otherPrisma.earning.findMany();
    const DiscordTransactions = await mainPrisma.transactions.findMany();

    let totalMoney = 0;
    let ourShare = 0;
    let moneyOut = 0;
    let MoneyOutOurShare = 0;
    let DiscoardAmount = 0;
    let ModelAmount = 0;

    const allTransactions = [...transactions, ...DiscordTransactions] as {
      id: string;
      amount: number;
      createdAt: string;
      lead: string;
      modelId: string;
      percentage: string;
      status: string;
      total: string;
      workerId: string;
    }[];

    const earnings = allTransactions
      .map((item) => ({
        id: item.id,
        type: item.modelId ? "Model" : "Discord",
        amount: item.total,
        ourShare: item.modelId
          ? ((Number(item.total) / 100) * 40).toFixed(1)
          : ((Number(item.total) / 100) * 50).toFixed(1),
        status: item.status,
        date: item.createdAt,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-")).getTime();
        const dateB = new Date(b.date.split("/").reverse().join("-")).getTime();
        return dateB - dateA;
      });

    transactions.forEach((item) => {
      ModelAmount += Number(item.total);
      totalMoney += Number(item.total);
      ourShare += (Number(item.total) / 100) * 40;
      if (item.status.toLocaleLowerCase() == "completed") {
        moneyOut += Number(item.total);
        MoneyOutOurShare +=
          (Number(item.total) / 100) * (100 - Number(item.percentage));
      }
    });
    console.log(totalMoney);
    DiscordTransactions.forEach((item) => {
      DiscoardAmount += Number(item.total);
      totalMoney += Number(item.total);
      ourShare += (Number(item.total) / 100) * 50;
      if (item.status.toLocaleLowerCase() == "completed") {
        moneyOut += Number(item.total);
        MoneyOutOurShare +=
          (Number(item.total) / 100) * (100 - Number(item.percentage));
      }
    });

    const chartData = [ModelAmount.toFixed(1), DiscoardAmount.toFixed(1), 0];

    return {
      MoneyIn: totalMoney.toFixed(1),
      OurShare: ourShare.toFixed(1),
      moneyOut: moneyOut.toFixed(1),
      MoneyOutOurShare: MoneyOutOurShare.toFixed(1),
      chartData,
      earnings,
    };
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

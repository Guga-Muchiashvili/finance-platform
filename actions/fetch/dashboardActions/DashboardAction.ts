"use server";
import {
  IDiscordEarning,
  IFormSubscription,
  ISubscription,
  Itransaction,
} from "@/common/types";
import { mainPrisma } from "../../../common/lib/db";

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

interface MonthlyAmounts {
  [key: string]: number;
}

export async function fetchDashboardData() {
  try {
    const transactions = await mainPrisma.earning.findMany();
    const DiscordTransactions = await mainPrisma.transactions.findMany();
    const Losses = await mainPrisma.subscription.findMany();
    const discordWorkers = await mainPrisma.discordWorkers.findMany();
    const modelWorkers = await mainPrisma.worker.findMany();
    const discordTransactions = await mainPrisma.transactions.findMany();
    const modelEarnings = await mainPrisma.earning.findMany();

    const combinedWorkers = [] as {
      type: string;
      name: string;
      earnings: string;
      active: boolean;
    }[];

    discordWorkers.forEach((worker) => {
      const totalEarnings = discordTransactions
        .filter((transaction) => transaction.workerId === worker.id)
        .reduce(
          (sum, transaction) =>
            sum +
            (Number(transaction.total) * Number(transaction.percentage)) / 100,
          0
        );

      combinedWorkers.push({
        type: "discord Worker",
        name: worker.name,
        earnings: totalEarnings.toFixed(1),
        active: worker.active,
      });
    });

    modelWorkers.forEach((worker) => {
      const totalEarnings = modelEarnings
        .filter((earning) => earning.workerId === worker.id)
        .reduce(
          (sum, earning) =>
            sum +
            (Number(earning.total) * (Number(earning.percentage) - 3.5)) / 100,
          0
        );

      if (worker.name == "Admin") return;
      combinedWorkers.push({
        type: "Model Worker",
        name: worker.name,
        earnings: totalEarnings.toFixed(1),
        active: worker.active,
      });
    });

    let totalMoney = 0;
    let ourShare = 0;
    let moneyOut = 0;
    let MoneyOutOurShare = 0;
    let DiscoardAmount = 0;
    let ModelAmount = 0;

    const allTransactions = [
      ...transactions,
      ...DiscordTransactions,
    ] as Itransaction[];

    const earnings = allTransactions
      .map((item) => ({
        id: item.id,
        type: item.modelId ? "Model" : "Discord",
        amount: item.total,
        ourShare: (
          (Number(item.total) / 100) *
          (100 - Number(item.percentage))
        ).toFixed(1),
        status: item.status,
        date: item.createdAt,
      }))
      .sort(
        (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
      );

    transactions.forEach((item) => {
      ModelAmount += Number(item.total);
      totalMoney += Number(item.total);
      ourShare += (Number(item.total) / 100) * (100 - Number(item.percentage));
      if (item.status.toLowerCase() === "completed") {
        moneyOut += Number(item.total);
        MoneyOutOurShare +=
          (Number(item.total) / 100) * (100 - Number(item.percentage));
      }
    });

    DiscordTransactions.forEach((item) => {
      DiscoardAmount += Number(item.total);
      totalMoney += Number(item.total);
      ourShare += (Number(item.total) / 100) * (100 - Number(item.percentage));
      if (item.status.toLowerCase() === "completed") {
        moneyOut += Number(item.total);
        MoneyOutOurShare +=
          (Number(item.total) / 100) * (100 - Number(item.percentage));
      }
    });

    const chartData = [ModelAmount.toFixed(1), DiscoardAmount.toFixed(1), 0];

    const firstTransactionOther = transactions[0]
      ? parseDate(transactions[0].createdAt)
      : null;
    const firstTransactionMain = DiscordTransactions[0]
      ? parseDate(DiscordTransactions[0].createdAt)
      : null;

    const firstTransactionDate =
      firstTransactionOther && firstTransactionMain
        ? new Date(
            Math.min(
              firstTransactionOther.getTime(),
              firstTransactionMain.getTime()
            )
          )
        : firstTransactionOther || firstTransactionMain;

    if (!firstTransactionDate) {
      throw new Error("No transactions found");
    }

    const generateGroupedAmounts = (
      transactions: Itransaction[] | IDiscordEarning[],
      firstTransactionDate: Date
    ): MonthlyAmounts => {
      const monthlyAmounts: MonthlyAmounts = {};
      const now = new Date();

      const monthsDiff =
        now.getMonth() -
        firstTransactionDate.getMonth() +
        (now.getFullYear() - firstTransactionDate.getFullYear()) * 12;

      const isMonthly = monthsDiff > 12;
      const isTwoWeekGrouped = monthsDiff > 1 && monthsDiff <= 12;

      let startMonth = firstTransactionDate.getMonth();
      let startYear = firstTransactionDate.getFullYear();

      if (isTwoWeekGrouped) {
        const currentDate = new Date(firstTransactionDate);
        while (currentDate <= now) {
          const endOfPeriod = new Date(currentDate);
          endOfPeriod.setDate(currentDate.getDate() + 13);

          const label = `${currentDate.toLocaleString("default", {
            month: "short",
          })} ${currentDate.getDate()} - ${endOfPeriod.getDate()}, ${currentDate.getFullYear()}`;

          if (!monthlyAmounts[label]) {
            monthlyAmounts[label] = 0;
          }

          transactions.forEach((transaction) => {
            const transactionDate = parseDate(transaction.createdAt);
            if (
              transactionDate >= currentDate &&
              transactionDate <= endOfPeriod
            ) {
              monthlyAmounts[label] += Number(transaction.total);
            }
          });

          currentDate.setDate(currentDate.getDate() + 14);
        }
      } else if (isMonthly) {
        while (
          startYear < now.getFullYear() ||
          (startYear === now.getFullYear() && startMonth <= now.getMonth())
        ) {
          const date = new Date(startYear, startMonth, 1);
          const monthLabel = `${date.toLocaleString("default", {
            month: "short",
          })} ${startYear}`;

          if (!monthlyAmounts[monthLabel]) {
            monthlyAmounts[monthLabel] = 0;
          }

          transactions.forEach((transaction) => {
            const transactionDate = parseDate(transaction.createdAt);
            if (
              transactionDate.getMonth() === startMonth &&
              transactionDate.getFullYear() === startYear
            ) {
              monthlyAmounts[monthLabel] += Number(transaction.total);
            }
          });

          startMonth++;
          if (startMonth > 11) {
            startMonth = 0;
            startYear++;
          }
        }
      } else {
        const monthLabel = `${now.toLocaleString("default", {
          month: "short",
        })} ${now.getFullYear()}`;
        if (!monthlyAmounts[monthLabel]) {
          monthlyAmounts[monthLabel] = 0;
        }

        transactions.forEach((transaction) => {
          const transactionDate = parseDate(transaction.createdAt);
          if (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          ) {
            monthlyAmounts[monthLabel] += Number(transaction.total);
          }
        });
      }

      return monthlyAmounts;
    };

    const monthlyAmountsOther = generateGroupedAmounts(
      transactions,
      firstTransactionDate
    );
    const monthlyAmountsMain = generateGroupedAmounts(
      DiscordTransactions,
      firstTransactionDate
    );

    const allPeriods = new Set([
      ...Object.keys(monthlyAmountsOther),
      ...Object.keys(monthlyAmountsMain),
    ]);

    const formattedChartData = [
      {
        label: "models",
        data: Array.from(allPeriods).map((period) => {
          return Number(monthlyAmountsOther[period]?.toFixed(1)) || 0;
        }),
      },
      {
        label: "Discord",
        data: Array.from(allPeriods).map((period) => {
          return Number(monthlyAmountsMain[period]?.toFixed(1)) || 0;
        }),
      },
    ];

    const ourShareChart = [
      {
        label: "models",
        data: Array.from(allPeriods).map((period) => {
          const percentage = Number(
            transactions.find(
              (t) =>
                parseDate(t.createdAt).getTime() === parseDate(period).getTime()
            )?.percentage ?? 40
          );

          return Number(
            (
              (Number(monthlyAmountsOther[period]) || 0) *
              (percentage / 100)
            ).toFixed(1)
          );
        }),
      },
      {
        label: "Discord",
        data: Array.from(allPeriods).map((period) => {
          const percentage = Number(
            DiscordTransactions.find(
              (t) =>
                parseDate(t.createdAt).getTime() === parseDate(period).getTime()
            )?.percentage ?? 50
          );

          return Number(
            (
              (Number(monthlyAmountsMain[period]) || 0) *
              (percentage / 100)
            ).toFixed(1)
          );
        }),
      },
    ];

    const totalOurShareChart = [
      {
        label: "Total Our Share",
        data: Array.from(allPeriods).map((period) => {
          const modelPercentage = Number(
            transactions.find(
              (item) =>
                parseDate(item.createdAt).toLocaleDateString() === period
            )?.percentage ?? 40
          );
          const discordPercentage = Number(
            DiscordTransactions.find(
              (item) =>
                parseDate(item.createdAt).toLocaleDateString() === period
            )?.percentage ?? 50
          );

          const modelShare =
            (Number(monthlyAmountsOther[period]?.toFixed(1)) || 0) *
            (modelPercentage / 100);

          const discordShare =
            (Number(monthlyAmountsMain[period]?.toFixed(1)) || 0) *
            (discordPercentage / 100);

          return Number((modelShare + discordShare).toFixed(1));
        }),
      },
    ];

    const months = [];
    const ourShareArray = [];
    const totalArray = [];

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let startMonth = firstTransactionDate.getMonth();
    let startYear = firstTransactionDate.getFullYear();

    while (
      startYear < currentYear ||
      (startYear === currentYear && startMonth <= currentMonth)
    ) {
      const date = new Date(startYear, startMonth, 1);
      const monthLabel = date.toLocaleString("default", { month: "short" });
      months.push(`${monthLabel} ${startYear}`);

      let monthlyTotal = 0;
      let monthlyOurShare = 0;

      DiscordTransactions.forEach((item) => {
        const transactionDate = parseDate(item.createdAt);
        if (
          transactionDate.getMonth() === startMonth &&
          transactionDate.getFullYear() === startYear
        ) {
          monthlyTotal += Number(item.total);
          monthlyOurShare +=
            (Number(item.total) / 100) * (100 - Number(item.percentage));
        }
      });
      transactions.forEach((item) => {
        const transactionDate = parseDate(item.createdAt);
        if (
          transactionDate.getMonth() === startMonth &&
          transactionDate.getFullYear() === startYear
        ) {
          monthlyTotal += Number(item.total);
          monthlyOurShare +=
            (Number(item.total) / 100) * (100 - Number(item.percentage));
        }
      });

      ourShareArray.push(Number(monthlyOurShare.toFixed(1)));
      totalArray.push(Number(monthlyTotal.toFixed(1)));

      startMonth++;
      if (startMonth > 11) {
        startMonth = 0;
        startYear++;
      }
    }
    return {
      MoneyIn: totalMoney.toFixed(1),
      OurShare: ourShare.toFixed(1),
      moneyOut: moneyOut.toFixed(1),
      MoneyOutOurShare: MoneyOutOurShare.toFixed(1),
      chartData,
      earnings,
      chartMonthlyData: formattedChartData,
      ourShareChart,
      totalOurShareChart,
      labels: Array.from(allPeriods).map((period) => period),
      subscriptions: Losses,
      months,
      ourShareArray,
      totalArray,
      combinedWorkers,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function addSubscription(
  data: IFormSubscription & { type: string }
): Promise<ISubscription> {
  try {
    const newSubscription = await mainPrisma.subscription.create({
      data: { ...data },
    });
    return newSubscription;
  } catch (error) {
    console.error("Error adding new transaction:", error);
    throw error;
  }
}

export async function editSubscription(
  id: string,
  updatedData: IFormSubscription & { type: string }
): Promise<ISubscription> {
  try {
    const SubscriptionToEdit = await mainPrisma.subscription.findUnique({
      where: { id },
    });

    if (!SubscriptionToEdit) {
      throw new Error(`Subscription with ID ${id} not found.`);
    }

    const updatedSubscription = await mainPrisma.subscription.update({
      where: { id },
      data: { ...updatedData },
    });

    return updatedSubscription;
  } catch (error) {
    console.error("Error editing Subscription:", error);
    throw error;
  }
}

export async function deleteSubscription(id: string): Promise<void> {
  try {
    const SubscriptionToDelete = await mainPrisma.subscription.findUnique({
      where: { id },
    });

    if (!SubscriptionToDelete) {
      throw new Error(`Subscription with ID ${id} not found.`);
    }

    await mainPrisma.subscription.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting Subscription:", error);
    throw error;
  }
}

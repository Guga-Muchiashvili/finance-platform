"use server";
import { INewTransaction, Itransaction } from "@/common/types";
import { otherPrisma } from "../../../common/lib/db";
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
    const transactions = await otherPrisma.earning.findMany();
    const DiscordTransactions = await mainPrisma.transactions.findMany();
    const Losses = await mainPrisma.subscription.findMany();

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
        ourShare: item.modelId
          ? ((Number(item.total) / 100) * 40).toFixed(1)
          : ((Number(item.total) / 100) * 50).toFixed(1),
        status: item.status,
        date: item.createdAt,
      }))
      .sort(
        (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
      );

    transactions.forEach((item) => {
      ModelAmount += Number(item.total);
      totalMoney += Number(item.total);
      ourShare += (Number(item.total) / 100) * 40;
      if (item.status.toLowerCase() === "completed") {
        moneyOut += Number(item.total);
        MoneyOutOurShare +=
          (Number(item.total) / 100) * (100 - Number(item.percentage));
      }
    });

    DiscordTransactions.forEach((item) => {
      DiscoardAmount += Number(item.total);
      totalMoney += Number(item.total);
      ourShare += (Number(item.total) / 100) * 50;
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
      transactions: Itransaction[] | INewTransaction[],
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
          return Number(
            (
              (Number(monthlyAmountsOther[period]?.toFixed(1)) || 0) * 0.4
            ).toFixed(1)
          );
        }),
      },
      {
        label: "Discord",
        data: Array.from(allPeriods).map((period) => {
          return Number(
            (
              (Number(monthlyAmountsMain[period]?.toFixed(1)) || 0) * 0.5
            ).toFixed(1)
          );
        }),
      },
    ];

    const totalOurShareChart = [
      {
        label: "Total Our Share",
        data: Array.from(allPeriods).map((period) => {
          const totalOurShareForPeriod =
            (Number(monthlyAmountsOther[period]?.toFixed(1)) || 0) * 0.4 +
            (Number(monthlyAmountsMain[period]?.toFixed(1)) || 0) * 0.5;
          return Number(totalOurShareForPeriod.toFixed(1));
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
          monthlyOurShare += (Number(item.total) / 100) * 50;
        }
      });
      transactions.forEach((item) => {
        const transactionDate = parseDate(item.createdAt);
        if (
          transactionDate.getMonth() === startMonth &&
          transactionDate.getFullYear() === startYear
        ) {
          monthlyTotal += Number(item.total);
          monthlyOurShare += (Number(item.total) / 100) * 40;
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
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

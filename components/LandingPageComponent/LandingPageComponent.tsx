"use client";
import BarChartComponent from "@/common/components/BarChartComponent/BarChartComponent";
import LineChartComponent from "@/common/components/LineChartComponent/LineChartComponent";
import PieChartComponent from "@/common/components/PieChartComponent/PieChartComponent";
import { timePeriods } from "@/common/constants";
import { useState } from "react";
import { motion } from "framer-motion";
import PaymentBoxElement from "./elements/PaymentBoxElement";
import LoseBoxElement from "./elements/LoseBoxElement";
import { useGetDashboardData } from "@/queries/useGetDashboardData/useGetDashboardData";

export default function LandingPageComponent() {
  const [filter, setfilter] = useState<"overall" | "last Month" | "last Week">(
    "overall"
  );

  const { data } = useGetDashboardData();

  return (
    <div className="w-full flex flex-col gap-4 min-h-screen p-4 bg-gray-100">
      <div className="w-full h-20 flex items-center justify-between">
        <h1 className="text-4xl text-blue-600">Ai Agency / Dashboard</h1>
        <div className={`w-fit flex items-center gap-2 flex-wrap`}>
          {timePeriods.map((item, i) => (
            <motion.h1
              initial={{ opacity: 0, translateX: 10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                duration: 1,
                delay: i * 0.2,
              }}
              key={item}
              className={`${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
              } px-1 lg:px-3 py-[6px] rounded-xl cursor-pointer duration-500 font-bebas text-sm lg:text-xl`}
              onClick={() =>
                setfilter(item as "overall" | "last Month" | "last Week")
              }
            >
              {item}
            </motion.h1>
          ))}
        </div>
      </div>
      <div className="w-full h-[20vh] text-blue-600 flex flex-col gap-4">
        <div className="flex h-full justify-center gap-4 w-full items-center">
          <div className="w-full bg-white h-fit py-8 rounded-xl p-3">
            <h1 className="text-2xl">Money in</h1>
            <h1 className="text-6xl mt-4">{data?.MoneyIn}$</h1>
          </div>
          <div className="w-full bg-white h-fit py-8 rounded-xl p-3">
            <h1 className="text-2xl">Money Out</h1>
            <h1 className="text-6xl mt-4">{data?.moneyOut}$</h1>
          </div>
          <div className="w-full bg-white h-fit py-8 rounded-xl p-3">
            <h1 className="text-2xl">Our share</h1>
            <h1 className="text-6xl mt-4">{data?.OurShare}$</h1>
          </div>
          <div className="w-full bg-white h-fit py-8 rounded-xl p-3">
            <h1 className="text-2xl"> Our share brought out</h1>
            <h1 className="text-6xl mt-4">{data?.MoneyOutOurShare}$</h1>
          </div>
        </div>
      </div>
      <div className="w-full h-1/2 flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">sources of income</h1>
        <div className="flex justify-center gap-4 items-center">
          <div className="w-[35%]">
            <BarChartComponent
              label={["Models", "Discord", "Dropshipping"]}
              chartData={data?.chartData as number[]}
            />
          </div>
          <div className="w-[33%]">
            <PieChartComponent
              label={["Models", "Discord", "Dropshipping"]}
              chartData={data?.chartData as number[]}
            />
          </div>
          <div className="w-[30%]">
            <LineChartComponent
              label={data?.labels}
              datas={data?.chartMonthlyData}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Our incomes</h1>
        <div className="flex justify-center gap-4 items-center">
          <div className="w-[58%]">
            <LineChartComponent
              label={data?.labels}
              datas={data?.ourShareChart}
            />
          </div>
          <div className="w-[58%]">
            <LineChartComponent
              label={data?.labels}
              datas={data?.totalOurShareChart}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-1/2 flex flex-col text-blue-600 gap-4">
        <h1 className="text-2xl ">Transactions</h1>
        <div className="flex justify-center gap-4 items-center">
          <div className="w-1/2 min-h-fit bg-white rounded-xl p-3">
            <h1>All transaction</h1>
            <div className="w-full h-8 flex items-center justify-between px-7">
              <h1 className="w-1/4 text-center">Type</h1>
              <h1 className="w-1/4 text-center">Amount</h1>
              <h1 className="w-1/4 text-center">Our Share</h1>
              <h1 className="w-1/4 text-center">Date</h1>
              <h1 className="w-1/4 text-center">Status</h1>
            </div>
            <div className="w-full h-72 overflow-y-scroll hide-scrollbar pb-4">
              {data?.earnings
                .slice()
                .reverse()
                .map((item) => (
                  <PaymentBoxElement
                    key={item.id}
                    amount={item.amount}
                    date={item.date}
                    ourShare={item.ourShare}
                    status={item.status}
                    type={item.type}
                  />
                ))}
            </div>
          </div>
          <div className="w-1/2 min-h-fit bg-white rounded-xl p-3">
            <h1>Subscriptions</h1>
            <div className="w-full h-8 flex items-center justify-between px-7">
              <h1 className="w-1/4 text-center">Reason</h1>
              <h1 className="w-1/4 text-center">Type</h1>
              <h1 className="w-1/4 text-center">Amount</h1>
              <h1 className="w-1/4 text-center">Date</h1>
              <h1 className="w-1/4 text-center">Status</h1>
            </div>
            <div className="w-full h-72 overflow-y-scroll hide-scrollbar pb-4">
              {data?.subscriptions.map((item) => (
                <LoseBoxElement key={item.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

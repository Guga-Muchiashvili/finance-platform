"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { timePeriods } from "@/common/constants";
import LineChartComponent from "@/common/components/LineChartComponent/LineChartComponent";
import { useGetModelDashboardData } from "@/queries/useGetModelDashboardData/useGetModelDashboardData";

const ModelsDashboard = () => {
  const [filter, setFilter] = useState<"overall" | "last Month" | "last Week">(
    "overall"
  );
  const { data: DashboardData } = useGetModelDashboardData();

  const labels = DashboardData?.workerChartData[0]?.data.map((_, index) => {
    return `${index}`;
  });

  return (
    <div className="w-full flex flex-col gap-4 min-h-screen text-blue-600 p-4 bg-gray-100">
      <div className="w-full h-20 flex items-center justify-between">
        <h1 className="text-4xl text-blue-600">Ai Agency / Models</h1>
        <div className="w-fit flex items-center gap-2 flex-wrap">
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
              } px-3 py-2 rounded-xl cursor-pointer duration-500 font-bebas text-xl`}
              onClick={() =>
                setFilter(item as "overall" | "last Month" | "last Week")
              }
            >
              {item}
            </motion.h1>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Money In</h1>
          <h1 className="text-6xl mt-4">{DashboardData?.moneyIn}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Money Out</h1>
          <h1 className="text-6xl mt-4">{DashboardData?.moneyOut}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Our Share</h1>
          <h1 className="text-6xl mt-4">{DashboardData?.ourShare}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Our Share Brought Out</h1>
          <h1 className="text-6xl mt-4">
            {DashboardData?.ourShareBroughtOut}$
          </h1>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Models incomes</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[58%]">
            <LineChartComponent
              label={labels}
              datas={DashboardData?.modelChartData}
            />
          </div>
          <div className="w-full md:w-[58%] bg-white rounded-xl p-3 shadow">
            <div className="flex justify-between mb-2">
              <h1 className="text-2xl">Models</h1>
              <button className="bg-blue-600 text-white h-10 rounded-xl px-3 py-1 text-xl">
                Add Model
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DashboardData?.models.map((item) => (
                <div
                  className="w-full h-20 mt-4 flex items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Workers incomes</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[58%]">
            <LineChartComponent
              label={labels}
              datas={DashboardData?.workerChartData}
            />
          </div>
          <div className="w-full md:w-[58%] bg-white rounded-xl p-3 shadow">
            <div className="flex justify-between mb-2">
              <h1 className="text-2xl">Workers</h1>
              <button className="bg-blue-600 text-white h-10 rounded-xl px-3 py-1 text-xl">
                Add Worker
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DashboardData?.workers.map((item) => (
                <div
                  className="w-full h-20 mt-4 flex items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 mt-14">
        <h1 className="text-2xl text-blue-600">All transactions</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white h-fit py-4 rounded-xl p-3 shadow">
            <div className="flex justify-between">
              <h1 className="text-2xl">Transactions</h1>
              <button className="bg-blue-600 text-white rounded-xl px-3 py-1 text-xl">
                Add Transaction
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DashboardData?.transactions.map((item) => (
                <div
                  className="w-full h-20 mt-4 flex items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  {item.createdAt}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white h-fit py-4 rounded-xl p-3 shadow">
            <div className="flex justify-between">
              <h1 className="text-2xl">Losses</h1>
              <button className="bg-blue-600 text-white rounded-xl px-3 py-1 text-xl">
                Add Losses
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[10vh] mt-12 rounded-xl text-xl text-blue-600 bg-white flex items-center justify-between p-4 shadow">
        <h1>
          Platform:{" "}
          <a href="https://ai-agency-xi.vercel.app/" className="underline">
            Click Here
          </a>
        </h1>
        <h1>
          Drive:{" "}
          <a href="https://drive.google.com" className="underline">
            Click Here
          </a>
        </h1>
        <h1>Our Share: 40%</h1>
        <h1>Workers: 7</h1>
        <h1>Models: 3</h1>
        <button className="text-white bg-blue-600 px-6 py-1 rounded-xl cursor-pointer">
          Credentials
        </button>
      </div>
    </div>
  );
};

export default ModelsDashboard;

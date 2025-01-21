"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { timePeriods } from "@/common/constants";
import LineChartComponent from "@/common/components/LineChartComponent/LineChartComponent";
import { useGetDashboardData } from "@/queries/useGetDashboardData/useGetDashboardData";

const ModelsDashboard = () => {
  const [filter, setfilter] = useState<"overall" | "last Month" | "last Week">(
    "overall"
  );

  const { data } = useGetDashboardData();

  return (
    <div className="w-full flex flex-col gap-4 min-h-screen text-blue-600 p-4 bg-gray-100">
      <div className="w-full h-20 flex items-center justify-between">
        <h1 className="text-4xl text-blue-600">Ai Agency / Models</h1>
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
            <h1 className="text-6xl mt-4">1,890$</h1>
          </div>
          <div className="w-full bg-white h-fit py-8 rounded-xl p-3">
            <h1 className="text-2xl">Money Out</h1>
            <h1 className="text-6xl mt-4">1,340$</h1>
          </div>
          <div className="w-full bg-white h-fit py-8 rounded-xl p-3">
            <h1 className="text-2xl">Our share</h1>
            <h1 className="text-6xl mt-4">967$</h1>
          </div>
          <div className="w-full bg-white h-fit py-8 rounded-xl p-3">
            <h1 className="text-2xl"> Our share brought out</h1>
            <h1 className="text-6xl mt-4">798$</h1>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Models incomes</h1>
        <div className="flex justify-center h-[50vh] gap-4 items-center">
          <div className="w-[58%]">
            <LineChartComponent
              label={data?.labels}
              datas={data?.ourShareChart}
            />
          </div>
          <div className="w-[58%] h-full">
            <div className="w-full bg-white h-full py-4 rounded-xl p-3">
              <div className="w-full h-full flex justify-between">
                <h1 className="text-2xl">Models</h1>
                <button className="bg-blue-600 text-white h-10 rounded-xl px-3 py-1 text-xl">
                  Add Models
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 h-[50vh]">
        <h1 className="text-2xl text-blue-600">Models incomes</h1>
        <div className="flex justify-center gap-4 items-center">
          <div className="w-[58%]">
            <LineChartComponent
              label={data?.labels}
              datas={data?.ourShareChart}
            />
          </div>
          <div className="w-[58%] h-full">
            <div className="w-full bg-white h-full py-4 rounded-xl p-3">
              <div className="w-full h-full flex justify-between">
                <h1 className="text-2xl">Models</h1>
                <button className="bg-blue-600 h-10 text-white rounded-xl px-3 py-1 text-xl">
                  Add Models
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-4 h-[50vh] mt-14">
        <h1 className="text-2xl text-blue-600">Models incomes</h1>
        <div className="flex gap-4 h-full mt-3">
          <div className="w-full bg-white h-full py-4 rounded-xl p-3">
            <div className="w-full h-fit flex justify-between">
              <h1 className="text-2xl">Transactions</h1>
              <button className="bg-blue-600 text-white rounded-xl px-3 py-1 text-xl">
                Add Models
              </button>
            </div>
          </div>
          <div className="w-full bg-white h-full py-4 rounded-xl p-3">
            <div className="w-full h-fit flex justify-between">
              <h1 className="text-2xl">Looses</h1>
              <button className="bg-blue-600 text-white rounded-xl px-3 py-1 text-xl">
                Add Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[10vh] mt-12 rounded-xl text-xl text-blue-600 bg-white flex items-center justify-between p-4">
        <h1>
          platform : <a href="https://ai-agency-xi.vercel.app/"> Click Here</a>
        </h1>
        <h1>
          Drive:{" "}
          <a href="https://drive.google.com/drive/folders/19GEHMTZutvwSMlcUuD5jJM3fzDsuiM8_?dmr=1&ec=wgc-drive-hero-goto">
            Click Here
          </a>
        </h1>
        <h1>Our Share : 40%</h1>
        <h1>Workers : 7</h1>
        <h1>Models : 3</h1>
        <h1 className="text-white bg-blue-600 px-6 py-1 rounded-xl cursor-pointer">
          Credentials
        </h1>
      </div>
    </div>
  );
};

export default ModelsDashboard;

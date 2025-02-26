"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import BarChartComponent from "@/common/components/BarChartComponent/BarChartComponent";
import LineChartComponent from "@/common/components/LineChartComponent/LineChartComponent";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useGetDiscordDashboardData } from "@/queries/DiscordQueries/useGetDiscordDasboardData/useGetDiscordDashboardData";
import useDeleteTransactionMutation from "@/mutations/ModelMutations/DeleteTransaction";
import useDeleteSubscriptionMutation from "@/mutations/CommonMutations/DeleteSubscription";
import ConfirmationModal from "../ModelsDashboardComponent/elements/ConfirmationModal";

const DiscordComponent = () => {
  const { data: DiscordData } = useGetDiscordDashboardData();
  const { mutate: deleteTransaction } = useDeleteTransactionMutation();
  const { mutate: deleteSubscription } = useDeleteSubscriptionMutation();

  const [isTransactionModalOpen, setisTransactionModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedSubscription, setselectedSubscription] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState("");

  const route = useRouter();

  const handleDeleteLeadSubscription = (leadId: string) => {
    setselectedSubscription(leadId);
    setIsSubscriptionModalOpen(true);
  };
  const handleDeleteTransactionClick = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setisTransactionModalOpen(true);
  };
  const handleConfirmSubscriptionDelete = () => {
    if (selectedSubscription) deleteSubscription(selectedSubscription);
    setIsSubscriptionModalOpen(false);
  };
  const handleConfirmTransactionDelete = () => {
    if (selectedTransactionId) deleteTransaction(selectedTransactionId);
    setisTransactionModalOpen(false);
  };

  const handleCancelDelete = () => {
    setisTransactionModalOpen(false);
    setIsSubscriptionModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 min-h-screen text-blue-600 p-4 bg-gray-100">
      <div className="w-full h-20 flex items-center justify-between">
        <h1 className="text-4xl text-blue-600">Ai Agency / Discord</h1>
        <div className="w-fit flex items-center gap-2 flex-wrap">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
            className={`
          bg-blue-600 text-white
           px-3 py-2 rounded-xl cursor-pointer duration-500 font-bebas text-xl`}
          >
            Overall
          </motion.h1>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Money In</h1>
          <h1 className="text-6xl mt-4">{DiscordData?.totalIn}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Money Out</h1>
          <h1 className="text-6xl mt-4">{DiscordData?.totalOut}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Our Share</h1>
          <h1 className="text-6xl mt-4">{DiscordData?.ourShareTotal}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Our Share Brought Out</h1>
          <h1 className="text-6xl mt-4">{DiscordData?.ourShareOut}$</h1>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Models incomes</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <BarChartComponent
              label={DiscordData?.months}
              chartData={DiscordData?.MonthChartData}
            />
          </div>
          <div className="w-full md:w-1/2">
            <LineChartComponent
              datas={[
                {
                  label: "Discord Transactions",
                  data: DiscordData?.dataLineChart.data || [],
                },
              ]}
              label={DiscordData?.dataLineChart.labels}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-10">
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Transaction Fees</h1>
          <h1 className="text-6xl mt-4">{DiscordData?.totalFee}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Average Transaction</h1>
          <h1 className="text-6xl mt-4">
            {DiscordData?.averageTransactionAmount}$
          </h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Transaction Record</h1>
          <h1 className="text-6xl mt-4">{DiscordData?.biggestTransaction}$</h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Streak</h1>
          <h1 className="text-6xl mt-4">2 day</h1>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Workers incomes</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[58%]">
            <LineChartComponent
              datas={[
                {
                  label: "Discord Transactions",
                  data: DiscordData?.dataLineChart.data || [],
                },
              ]}
              label={DiscordData?.dataLineChart.labels}
            />
          </div>
          <div className="w-full md:w-[58%] bg-white rounded-xl p-3 shadow">
            <div className="flex justify-between mb-2">
              <h1 className="text-2xl">Workers</h1>
              <button
                className="bg-blue-600 text-white h-10 rounded-xl px-3 py-1 text-xl"
                onClick={() => route.push("/Dashboard/Discord/worker/Create")}
              >
                Add Worker
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DiscordData?.workers?.map((item) => (
                <div
                  className="w-full h-20 mt-4 flex relative items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  {item.name}
                  <FaEdit
                    className="text-green-600 absolute right-9 cursor-pointer"
                    onClick={() => route.push(`Discord/worker/Edit/${item.id}`)}
                  />
                  <FaTrash className="text-red-500 absolute right-3 cursor-pointer" />
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
              <button
                className="bg-blue-600 text-white rounded-xl px-3 py-1 text-xl"
                onClick={() => route.push("Discord/transactions/Create")}
              >
                Add Transaction
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DiscordData?.transactions?.map((item) => (
                <div
                  className="w-full h-20 justify-between px-12 pr-20  relative mt-4 flex items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  <h1 className="text-2xl">{item.lead || "Anonymous"}</h1>
                  <h1 className="text-2xl">{item.createdAt}</h1>
                  <h1 className="text-2xl">{item.status}</h1>
                  <h1 className="text-2xl">{item.total}$</h1>
                  <h1 className="text-2xl">{item.percentage}%</h1>
                  <FaEdit
                    className="text-green-600 absolute right-9 cursor-pointer"
                    onClick={() =>
                      route.push(`Discord/transactions/edit/${item.id}`)
                    }
                  />
                  <FaTrash
                    className="text-red-500 absolute right-3 cursor-pointer"
                    onClick={() => handleDeleteTransactionClick(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white h-fit py-4 rounded-xl p-3 shadow">
            <div className="flex justify-between">
              <h1 className="text-2xl">Expenses</h1>
              <button
                className="bg-blue-600 text-white rounded-xl px-3 py-1 text-xl"
                onClick={() => route.push("Discord/subscriptions/Create")}
              >
                Add Expense
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DiscordData?.DiscordSubstiptions?.map((item) => (
                <div
                  className="w-full h-20 justify-between px-12 pr-20  relative mt-4 flex items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  <h1 className="text-2xl">{item.reason || "Anonymous"}</h1>
                  <h1 className="text-2xl">{item.amount}$</h1>
                  <h1 className="text-2xl">{item.date}$</h1>
                  <button className="text-white px-4 bg-blue-600 py-2 text-xl rounded-xl">
                    {item.status}
                  </button>
                  <FaEdit
                    className="text-green-600 absolute right-9 cursor-pointer"
                    onClick={() =>
                      route.push(`Discord/subscriptions/Edit/${item.id}`)
                    }
                  />
                  <FaTrash
                    className="text-red-500 absolute right-3 cursor-pointer"
                    onClick={() => handleDeleteLeadSubscription(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isTransactionModalOpen && (
        <ConfirmationModal
          close={handleCancelDelete}
          deleteFunction={handleConfirmTransactionDelete}
          title="Are you sure you want to delete this transaction?"
        />
      )}
      {isSubscriptionModalOpen && (
        <ConfirmationModal
          close={handleCancelDelete}
          deleteFunction={handleConfirmSubscriptionDelete}
          title="Are you sure you want to delete this Subscription?"
        />
      )}
    </div>
  );
};

export default DiscordComponent;

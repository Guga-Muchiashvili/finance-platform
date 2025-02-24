"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import LineChartComponent from "@/common/components/LineChartComponent/LineChartComponent";
import { useGetModelDashboardData } from "@/queries/DashboardQueries/useGetModelDashboardData/useGetModelDashboardData";
import BarChartComponent from "@/common/components/BarChartComponent/BarChartComponent";
import PieChartComponent from "@/common/components/PieChartComponent/PieChartComponent";
import { useRouter } from "next/navigation";
import useDeleteModelMutation from "@/mutations/ModelMutations/DeleteModel";
import { FaEdit, FaTrash } from "react-icons/fa";
import useDeleteWorker from "@/mutations/ModelMutations/DeleteWorker";
import useDeleteTransactionMutation from "@/mutations/ModelMutations/DeleteTransaction";
import { useGetWorkersSallary } from "@/queries/DashboardQueries/useGetPaymentAmount/useGetPaymentAmount";
import useDeleteLeadlMutation from "@/mutations/ModelMutations/DeleteLead";
import ConfirmationModal from "./elements/ConfirmationModal";

const ModelsDashboard = () => {
  const { data: DashboardData } = useGetModelDashboardData();
  const { data: workerSallary } = useGetWorkersSallary();
  const route = useRouter();

  const { mutate: deleteModel } = useDeleteModelMutation();
  const { mutate: deleteWorker } = useDeleteWorker();
  const { mutate: deleteTransaction } = useDeleteTransactionMutation();
  const { mutate: deleteLead } = useDeleteLeadlMutation();

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isLeadModelOpen, setIsLeadModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState("");

  const ModelLabels =
    DashboardData?.ModelsPieData?.map((data) => `${data.label}`) || [];
  const WorkersLabel =
    DashboardData?.WorkersPieData?.map((data) => `${data.label}`) || [];
  const MonthBarLabels =
    DashboardData?.moneyByMonth?.map((data) => `${data.label}`) || [];
  const ModelData =
    DashboardData?.ModelsPieData?.map((data) => Number(data.value)) || [];
  const WorkersData =
    DashboardData?.WorkersPieData?.map((data) => Number(data.value)) || [];
  const MonthBarData =
    DashboardData?.moneyByMonth?.map((data) => Number(data.value)) || [];

  const handleDeleteModelClick = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelModalOpen(true);
  };

  const handleDeleteWorkerClick = (workerId: string) => {
    setSelectedWorkerId(workerId);
    setIsWorkerModalOpen(true);
  };

  const handleDeleteLeadClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsLeadModalOpen(true);
  };

  const handleDeleteTransactionClick = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setIsTransactionModalOpen(true);
  };

  const handleConfirmModelDelete = () => {
    if (selectedModelId) deleteModel(selectedModelId);
    setIsModelModalOpen(false);
  };

  const handleConfirmLeadDelete = () => {
    if (selectedLeadId) deleteLead(selectedLeadId);
    setIsLeadModalOpen(false);
  };

  const handleConfirmWorkerDelete = () => {
    if (selectedWorkerId) deleteWorker(selectedWorkerId);
    setIsWorkerModalOpen(false);
  };

  const handleConfirmTransactionDelete = () => {
    if (selectedTransactionId) deleteTransaction(selectedTransactionId);
    setIsTransactionModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModelModalOpen(false);
    setIsWorkerModalOpen(false);
    setIsLeadModalOpen(false);
    setIsTransactionModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 min-h-screen text-blue-600 p-4 bg-gray-100">
      <div className="w-full h-20 flex items-center justify-between">
        <h1 className="text-4xl text-blue-600">Ai Agency / Models</h1>
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
          <div className="w-full md:w-1/3">
            <BarChartComponent
              label={MonthBarLabels}
              chartData={MonthBarData}
            />
          </div>
          <div className="w-full md:w-1/3">
            <PieChartComponent label={ModelLabels} chartData={ModelData} />
          </div>
          <div className="w-full md:w-1/3">
            <PieChartComponent label={WorkersLabel} chartData={WorkersData} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-10">
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Transaction Fees</h1>
          <h1 className="text-6xl mt-4">
            {DashboardData?.totalTransactionFee}$
          </h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Average Transaction</h1>
          <h1 className="text-6xl mt-4">
            {DashboardData?.averageTransactionTotal}$
          </h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Transaction Record</h1>
          <h1 className="text-6xl mt-4">
            {DashboardData?.maxTransactionTotal}$
          </h1>
        </div>
        <div className="bg-white h-fit py-8 rounded-xl p-3 shadow">
          <h1 className="text-2xl">Streak</h1>
          <h1 className="text-6xl mt-4">{DashboardData?.streak} day</h1>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Models incomes</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[58%]">
            <LineChartComponent
              label={DashboardData?.chartLabels}
              datas={DashboardData?.modelChartData}
            />
          </div>
          <div className="w-full md:w-[58%] bg-white rounded-xl p-3 shadow">
            <div className="flex justify-between mb-2">
              <h1 className="text-2xl">Models</h1>
              <button
                className="bg-blue-600 text-white h-10 rounded-xl px-3 py-1 text-xl"
                onClick={() => route.push("Models/Create")}
              >
                Add Model
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DashboardData?.models.map((item) => (
                <div
                  className="w-full h-20 mt-4 flex items-center relative border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  {item.name}
                  <FaEdit
                    className="text-green-600 absolute right-9 cursor-pointer"
                    onClick={() => route.push(`Models/Edit/${item.id}`)}
                  />
                  <FaTrash
                    className="text-red-500 absolute right-3 cursor-pointer"
                    onClick={() => handleDeleteModelClick(item.id)}
                  />
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
              label={DashboardData?.chartLabels}
              datas={DashboardData?.workerChartData}
            />
          </div>
          <div className="w-full md:w-[58%] bg-white rounded-xl p-3 shadow">
            <div className="flex justify-between mb-2">
              <h1 className="text-2xl">Workers</h1>
              <button
                className="bg-blue-600 text-white h-10 rounded-xl px-3 py-1 text-xl"
                onClick={() => route.push("/Dashboard/Models/Worker/create")}
              >
                Add Worker
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DashboardData?.workers.map((item) => (
                <div
                  className="w-full h-20 mt-4 flex relative items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  {item.name}
                  <FaEdit
                    className="text-green-600 absolute right-9 cursor-pointer"
                    onClick={() => route.push(`Models/Worker/edit/${item.id}`)}
                  />
                  <FaTrash
                    className="text-red-500 absolute right-3 cursor-pointer"
                    onClick={() => handleDeleteWorkerClick(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-blue-600">Active Leads</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[58%]">
            <BarChartComponent
              chartData={DashboardData?.LeadchartData}
              label={DashboardData?.Leadlabels}
            />
          </div>
          <div className="w-full md:w-[58%] bg-white rounded-xl p-3 shadow">
            <div className="flex justify-between mb-2">
              <h1 className="text-2xl">Leads</h1>
              <button
                className="bg-blue-600 text-white h-10 rounded-xl px-3 py-1 text-xl"
                onClick={() => route.push("/Dashboard/Models/Lead/create")}
              >
                Add Lead
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DashboardData?.leads?.map((item) => (
                <div
                  className="w-full h-20 mt-4 flex relative items-center border-[1px] shadow-lg rounded-xl p-3"
                  key={item.id}
                >
                  {item.name}
                  <FaEdit
                    className="text-green-600 absolute right-9 cursor-pointer"
                    onClick={() => route.push(`Models/Lead/edit/${item.id}`)}
                  />
                  <FaTrash
                    className="text-red-500 absolute right-3 cursor-pointer"
                    onClick={() => handleDeleteLeadClick(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 mt-14">
        <h1 className="text-2xl text-blue-600">Workers Sallary</h1>
        <div className="">
          <div className="bg-white h-fit py-4 rounded-xl p-3 shadow">
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {workerSallary
                ?.filter((item) => item.name !== "Admin")
                .map((item) => (
                  <div
                    className="w-full h-20 justify-between px-12 pr-20  relative mt-4 flex items-center border-[1px] shadow-lg rounded-xl p-3"
                    key={item.id}
                  >
                    <h1 className="text-2xl w-32">{item.name}</h1>
                    <h1 className="text-2xl text-right w-36 flex items-center justify-center ">
                      {item.amountDue}$
                    </h1>
                    <h1 className="text-2xl w-32">
                      paid : {item.totalSalaryPaid}$
                    </h1>
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
                onClick={() => route.push("Models/transactions/create")}
              >
                Add Transaction
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar">
              {DashboardData?.transactions
                .slice()
                .reverse()
                .map((item) => (
                  <div
                    className="w-full h-20 justify-between px-12 pr-20  relative mt-4 flex items-center border-[1px] shadow-lg rounded-xl p-3"
                    key={item.id}
                  >
                    <h1 className="text-2xl">{item.lead}</h1>
                    <h1 className="text-2xl">{item.createdAt}</h1>
                    <h1 className="text-2xl">{item.status}</h1>
                    <h1 className="text-2xl">{item.total}$</h1>
                    <h1 className="text-2xl">{item.percentage}%</h1>
                    <FaEdit
                      className="text-green-600 absolute right-9 cursor-pointer"
                      onClick={() =>
                        route.push(`Models/transactions/edit/${item.id}`)
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
              <button className="bg-blue-600 text-white rounded-xl px-3 py-1 text-xl">
                Add Expense
              </button>
            </div>
            <div className="h-[40vh] overflow-y-auto hide-scrollbar"></div>
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
        <h1>Workers: {DashboardData?.workers.length}</h1>
        <h1>Models: {DashboardData?.models.length}</h1>
        <button className="text-white bg-blue-600 px-6 py-1 rounded-xl cursor-pointer">
          Credentials
        </button>
      </div>

      {isModelModalOpen && (
        <ConfirmationModal
          close={handleCancelDelete}
          deleteFunction={handleConfirmModelDelete}
          title="Are you sure you want to delete this Model?"
        />
      )}
      {isLeadModelOpen && (
        <ConfirmationModal
          close={handleCancelDelete}
          deleteFunction={handleConfirmLeadDelete}
          title="Are you sure you want to delete this Lead?"
        />
      )}

      {isTransactionModalOpen && (
        <ConfirmationModal
          close={handleCancelDelete}
          deleteFunction={handleConfirmTransactionDelete}
          title="Are you sure you want to delete this transaction?"
        />
      )}
      {isWorkerModalOpen && (
        <ConfirmationModal
          close={handleCancelDelete}
          deleteFunction={handleConfirmWorkerDelete}
          title="Are you sure you want to delete this worker?"
        />
      )}
    </div>
  );
};

export default ModelsDashboard;

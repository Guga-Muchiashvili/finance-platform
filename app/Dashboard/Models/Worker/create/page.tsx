"use client";
import dynamic from "next/dynamic";
const CreateEditWorkerComponent = dynamic(
  () =>
    import("@/components/CreateEditWorkerComponent/CreateEditWorkerComponent"),
  { ssr: false }
);
import { IFormWorker } from "@/common/types";
import React from "react";

const page = () => {
  const defaultValues: IFormWorker = {
    earnings: [],
    modelId: "",
    name: "",
    profit: "0",
    active: false,
    phoneNumber: "",
    transactionAdress: "",
    email: "",
    idNumber: "",
  };
  return <CreateEditWorkerComponent defaultValues={defaultValues} />;
};

export default page;

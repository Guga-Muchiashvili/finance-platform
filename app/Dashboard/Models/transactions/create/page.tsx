"use client";
import { IFormEarning } from "@/common/types";
import dynamic from "next/dynamic";
const CreateEditTransaction = dynamic(
  () =>
    import(
      "@/components/CreateEditTransactionComponent/CreateEditTransactionComponent"
    ),
  { ssr: false }
);
const page = () => {
  const defaultValues: IFormEarning = {
    amount: 0,
    createdAt: "",
    lead: "",
    modelId: "",
    percentage: "",
    status: "",
    total: "",
    workerId: "",
  };

  return <CreateEditTransaction defaultValues={defaultValues} />;
};

export default page;

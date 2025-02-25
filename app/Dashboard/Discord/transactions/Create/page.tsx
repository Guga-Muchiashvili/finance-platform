"use client";
import { IFormDiscordEarning } from "@/common/types";
import dynamic from "next/dynamic";
const CreateEditDiscordTransaction = dynamic(
  () =>
    import(
      "@/components/CreateEditDiscordTransactionComponent/CreateEditDiscordTransactionComponent"
    ),
  { ssr: false }
);
const page = () => {
  const defaultValues: IFormDiscordEarning = {
    amount: 0,
    createdAt: "",
    lead: "",
    percentage: "",
    status: "",
    total: "",
    workerId: "",
  };

  return <CreateEditDiscordTransaction defaultValues={defaultValues} />;
};

export default page;

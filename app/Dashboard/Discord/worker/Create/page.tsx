"use client";
import dynamic from "next/dynamic";
const CreateEditDiscordWorker = dynamic(
  () =>
    import(
      "@/components/CreateEditDiscordWorkerComponent/CreateEditDiscordWorkerComponent"
    ),
  { ssr: false }
);
import { IFormDiscordWorker } from "@/common/types";
import React from "react";

const page = () => {
  const defaultValues: IFormDiscordWorker = {
    earnings: [],
    name: "",
  };
  return <CreateEditDiscordWorker defaultValues={defaultValues} />;
};

export default page;

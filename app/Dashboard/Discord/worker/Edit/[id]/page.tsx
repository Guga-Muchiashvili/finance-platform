import { FetchDiscordWorkersById } from "@/actions/fetch/fetch";
import { IDiscordWorker, IFormDiscordWorker } from "@/common/types";
import CreateEditDiscordWorker from "@/components/CreateEditDiscordWorkerComponent/CreateEditDiscordWorkerComponent";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const workerData: IDiscordWorker = await FetchDiscordWorkersById(id);

  const defaultValues: IFormDiscordWorker = {
    earnings: workerData.earnings,
    name: workerData.name,
  };
  return <CreateEditDiscordWorker defaultValues={defaultValues} id={id} />;
}

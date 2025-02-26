import { fetchWorkerById } from "@/actions/fetch/fetch";
import { IFormWorker } from "@/common/types";
import CreateEditWorkerComponent from "@/components/CreateEditWorkerComponent/CreateEditWorkerComponent";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const workerData = await fetchWorkerById(id);

  const defaultValues: IFormWorker = {
    earnings: workerData.earnings,
    modelId: workerData.modelId,
    name: workerData.name,
    profit: workerData.profit,
    active: workerData.active,
  };

  return <CreateEditWorkerComponent defaultValues={defaultValues} id={id} />;
}

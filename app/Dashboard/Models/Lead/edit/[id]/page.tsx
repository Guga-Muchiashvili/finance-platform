import { fetchLeadById } from "@/actions/fetch/fetch";
import { IFormLead, ILead } from "@/common/types";
import CreateEditLeadComponent from "@/components/CreateEditLeadComponent/CreateEditLeadComponent";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const LeadData: ILead = await fetchLeadById(id);

  const defaultValues: IFormLead = {
    active: LeadData.active,
    description: LeadData.description,
    img: LeadData.img,
    modelId: LeadData.modelId,
    name: LeadData.name,
    seen: LeadData.seen,
    workerId: LeadData.workerId,
  };
  return <CreateEditLeadComponent defaultValues={defaultValues} id={id} />;
}

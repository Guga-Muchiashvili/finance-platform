"use client";
import dynamic from "next/dynamic";
const CreateEditLeadComponent = dynamic(
  () => import("@/components/CreateEditLeadComponent/CreateEditLeadComponent"),
  { ssr: false }
);
import { IFormLead } from "@/common/types";
import React from "react";

const page = () => {
  const defaultValues: IFormLead = {
    active: false,
    description: "",
    img: "",
    modelId: [],
    name: "",
    seen: false,
    workerId: "",
  };
  return <CreateEditLeadComponent defaultValues={defaultValues} />;
};

export default page;

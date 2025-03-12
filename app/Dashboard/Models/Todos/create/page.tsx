"use client";
import dynamic from "next/dynamic";
const CreateEditTodoComponent = dynamic(
  () => import("@/components/CreateEditTodoComponent/CreateEditTodoComponent"),
  { ssr: false }
);
import { IFormTodo } from "@/common/types";
import React from "react";

const page = () => {
  const defaultValues: IFormTodo = {
    createdAt: "",
    title: "",
    type: "",
    workerId: [],
    deadline: "",
    description: "",
    label: "",
  };
  return <CreateEditTodoComponent defaultValues={defaultValues} />;
};

export default page;

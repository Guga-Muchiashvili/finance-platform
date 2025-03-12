import { fetchTodoById } from "@/actions/fetch/fetch";
import { IFormTodo, ITodo } from "@/common/types";
import CreateEditTodoComponent from "@/components/CreateEditTodoComponent/CreateEditTodoComponent";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const TodoData: ITodo = await fetchTodoById(id);

  const defaultValues: IFormTodo = {
    createdAt: TodoData.createdAt,
    title: TodoData.title,
    type: TodoData.type,
    workerId: TodoData.workerId,
    deadline: TodoData.deadline,
    description: TodoData.description,
    label: TodoData.label,
  };
  return <CreateEditTodoComponent defaultValues={defaultValues} id={id} />;
}

"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { todoSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import { usePathname, useRouter } from "next/navigation";
import MultiSelectFieldElement from "@/common/elements/MulitSelectElement/MultiSelectElement";
import { FaArrowLeft } from "react-icons/fa";
import DropdownFieldElement from "@/common/elements/DropdownElement/DropdownElement";
import { IFormTodo } from "@/common/types";
import { useGetWorkers } from "@/queries/ModelQueries/useGetWorkers/useGetWorkers";
import useEditTodoMutation from "@/mutations/ModelMutations/EditTodo";
import useAddTodoMutation from "@/mutations/ModelMutations/CreateTodo";

const CreateEditTodoComponent = ({
  defaultValues,
  id,
}: {
  defaultValues: IFormTodo;
  id?: string;
}) => {
  const { data: workers } = useGetWorkers();
  const { mutate: EditTodo } = useEditTodoMutation();
  const { mutate: createTodo } = useAddTodoMutation();
  const route = useRouter();

  const WorkerOptions = workers?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const methods = useForm<IFormTodo>({
    resolver: yupResolver(todoSchema),
    defaultValues,
  });

  const onSubmit = async (data: IFormTodo) => {
    if (currentPath.includes("create")) {
      createTodo(data);
    } else if (currentPath.includes("edit") && id) {
      EditTodo({ id, updatedData: data });
    }
  };

  const currentPath = usePathname();

  return (
    <div className="w-full min-h-full bg-gray-100 p-6 px-14">
      <h1 className="text-6xl text-blue-600">
        {currentPath.includes("create") ? "Create Todo" : "Edit Todo"}
      </h1>
      <h1
        className="text-blue-600 text-lg underline flex items-center gap-2 cursor-pointer"
        onClick={() => route.push("/Dashboard/Models")}
      >
        <FaArrowLeft className="text-sm" /> Go Back
      </h1>
      <FormComponent methods={methods} submit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-2xl text-blue-600">Todo Information</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="title" name="title" />
            <DropdownFieldElement
              label="label"
              name="label"
              options={[
                { label: "Must do", value: "MustDo" },
                { label: "Important", value: "Important" },
                { label: "Good To Do", value: "GoodToDo" },
              ]}
            />
            <DropdownFieldElement
              label="type"
              name="type"
              options={[
                { label: "Todo", value: "Todo" },
                { label: "Progress", value: "Progress" },
                { label: "Completed", value: "Completed" },
              ]}
            />
          </div>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="created at" name="createdAt" />
            <TextFieldElementComponent label="deadline" name="deadline" />
          </div>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <MultiSelectFieldElement
              label="workerId"
              name="workerId"
              options={WorkerOptions}
            />
            <TextFieldElementComponent label="description" name="description" />
          </div>
        </div>
        <div className="w-full items-center justify-end flex py-4">
          <button className="bg-blue-600 px-3 py-2 text-xl rounded-xl text-white">
            {currentPath.includes("create") ? "Create Todo" : "Edit Todo"}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CreateEditTodoComponent;

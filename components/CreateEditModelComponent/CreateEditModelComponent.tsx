"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { modelSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import { IFormModel } from "@/common/types";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import { usePathname, useRouter } from "next/navigation";
import MultiSelectFieldElement from "@/common/elements/MulitSelectElement/MultiSelectElement";
import { useGetWorkers } from "@/queries/ModelQueries/useGetWorkers/useGetWorkers";
import { useGetTransactions } from "@/queries/ModelQueries/useGetTransactions/useGetTransactions";
import useAddModelMutation from "@/mutations/ModelMutations/CreateModel";
import useEditModelMutation from "@/mutations/ModelMutations/EditModel";
import { FaArrowLeft } from "react-icons/fa";

const CreateEditModelComponent = ({
  defaultValues,
  id,
}: {
  defaultValues: IFormModel;
  id?: string;
}) => {
  const { data: workers } = useGetWorkers();
  const { data: transactions } = useGetTransactions();
  const { mutate: addModel } = useAddModelMutation();
  const { mutate: editModel } = useEditModelMutation();
  const route = useRouter();

  const WorkerOptions = workers?.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const TransactionOptions = transactions
    ?.map((item) => ({
      label: `${item.lead + " " + item.createdAt + " " + item.amount}$`,
      value: item.id,
    }))
    .reverse();

  const methods = useForm<IFormModel>({
    resolver: yupResolver(modelSchema),
    defaultValues,
  });

  const onSubmit = async (data: IFormModel) => {
    if (currentPath.includes("Create")) {
      addModel(data);
    } else if (currentPath.includes("Edit") && id) {
      editModel({ id, updatedData: data });
    }
  };

  const currentPath = usePathname();

  return (
    <div className="w-full min-h-full bg-gray-100 p-6 px-14">
      <h1 className="text-6xl text-blue-600">
        {currentPath.includes("Create") ? "Create Model" : "Edit Model"}
      </h1>
      <h1
        className="text-blue-600 text-lg underline flex items-center gap-2 cursor-pointer"
        onClick={() => route.push("/Dashboard/Models")}
      >
        <FaArrowLeft className="text-sm" /> Go Back
      </h1>
      <FormComponent methods={methods} submit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-2xl text-blue-600">Model Information</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="Name" name="name" />
            <TextFieldElementComponent label="age" name="age" />
            <TextFieldElementComponent name="country" label="country" />
            <TextFieldElementComponent label="date" name="date" />
          </div>
          <div className="w-full h-fit gap-9 bg-white p-3 rounded-xl">
            <TextFieldElementComponent label="description" name="description" />
          </div>
          <h1 className="text-2xl text-blue-600 mt-2">Model Social Media</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-3 p-3 rounded-xl">
            <TextFieldElementComponent label="telegram" name="telegram" />
            <TextFieldElementComponent label="drive" name="drive" />
            <TextFieldElementComponent label="image" name="image" />
            <TextFieldElementComponent label="email" name="email" />
            <TextFieldElementComponent label="password" name="password" />
            <TextFieldElementComponent label="milestone" name="milestone" />
          </div>
          <h1 className="text-2xl text-blue-600 mt-2">Additional Info</h1>

          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <MultiSelectFieldElement
              label="workers"
              name="workers"
              options={WorkerOptions}
            />
            <MultiSelectFieldElement
              label="earnings"
              name="earnings"
              options={TransactionOptions}
            />
          </div>
        </div>
        <div className="w-full items-center justify-end flex py-4">
          <button className="bg-blue-600 px-3 py-2 text-xl rounded-xl text-white">
            {currentPath.includes("Create") ? "Create Model" : "Edit Model"}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CreateEditModelComponent;

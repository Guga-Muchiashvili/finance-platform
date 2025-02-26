"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { workerSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import { IFormWorker } from "@/common/types";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import { usePathname, useRouter } from "next/navigation";
import MultiSelectFieldElement from "@/common/elements/MulitSelectElement/MultiSelectElement";
import { useGetTransactions } from "@/queries/ModelQueries/useGetTransactions/useGetTransactions";
import { FaArrowLeft } from "react-icons/fa";
import { useGetModels } from "@/queries/ModelQueries/useGetModelData/useGetModelData";
import useAddWorkerMutation from "@/mutations/ModelMutations/CreateWorker";
import DropdownFieldElement from "@/common/elements/DropdownElement/DropdownElement";
import useEditWorker from "@/mutations/ModelMutations/EditWorker";

const CreateEditWorkerComponent = ({
  defaultValues,
  id,
}: {
  defaultValues: IFormWorker;
  id?: string;
}) => {
  const { data: models } = useGetModels();
  const { data: transactions } = useGetTransactions();
  const { mutate: editWorker } = useEditWorker();
  const route = useRouter();

  const ModelOptions = models?.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const TransactionOptions = transactions
    ?.map((item) => ({
      label: `${item.lead + " " + item.createdAt + " " + item.amount}$`,
      value: item.id,
    }))
    .reverse();

  const methods = useForm<IFormWorker>({
    resolver: yupResolver(workerSchema),
    defaultValues,
  });

  const { mutate: createWorker } = useAddWorkerMutation();

  const onSubmit = async (data: IFormWorker) => {
    if (currentPath.includes("create")) {
      createWorker(data);
    } else if (currentPath.includes("edit") && id) {
      editWorker({ id, updatedData: data });
    }
  };

  const currentPath = usePathname();

  return (
    <div className="w-full min-h-full bg-gray-100 p-6 px-14">
      <h1 className="text-6xl text-blue-600">
        {currentPath.includes("create") ? "Create Worker" : "Edit Worker"}
      </h1>
      <h1
        className="text-blue-600 text-lg underline flex items-center gap-2 cursor-pointer"
        onClick={() => route.push("/Dashboard/Models")}
      >
        <FaArrowLeft className="text-sm" /> Go Back
      </h1>
      <FormComponent methods={methods} submit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-2xl text-blue-600">Worker Information</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="Name" name="name" />
            <DropdownFieldElement
              label="model"
              name="modelId"
              options={ModelOptions}
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
            {currentPath.includes("create") ? "Create Worker" : "Edit Worker"}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CreateEditWorkerComponent;

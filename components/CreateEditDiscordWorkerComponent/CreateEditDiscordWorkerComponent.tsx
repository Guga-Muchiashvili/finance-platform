"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DiscordworkerSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import { IFormDiscordWorker } from "@/common/types";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import { usePathname, useRouter } from "next/navigation";
import MultiSelectFieldElement from "@/common/elements/MulitSelectElement/MultiSelectElement";
import { FaArrowLeft } from "react-icons/fa";
import { useGetDiscordTransactions } from "@/queries/DiscordQueries/useGetDiscordTransaction/useGetDiscordTransaction";
import useEditDiscordWorkerMutation from "@/mutations/DiscordMutations/EditDiscordWorker";
import useAddDiscordWorkerMutation from "@/mutations/DiscordMutations/CreateDiscordWorker";
import ToggleElementComponent from "@/common/elements/ToggleElement/ToggleElement";

const CreateEditDiscordWorker = ({
  defaultValues,
  id,
}: {
  defaultValues: IFormDiscordWorker;
  id?: string;
}) => {
  const { data: transactions } = useGetDiscordTransactions();
  const { mutate: editWorker } = useEditDiscordWorkerMutation();
  const { mutate: createWorker } = useAddDiscordWorkerMutation();
  const route = useRouter();

  const TransactionOptions = transactions
    ?.map((item) => ({
      label: `${item.lead + " " + item.createdAt + " " + item.amount}$`,
      value: item.id,
    }))
    .reverse();

  const methods = useForm<IFormDiscordWorker>({
    resolver: yupResolver(DiscordworkerSchema),
    defaultValues,
  });

  const onSubmit = async (data: IFormDiscordWorker) => {
    if (currentPath.includes("Create")) {
      createWorker(data);
    } else if (currentPath.includes("Edit") && id) {
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
        onClick={() => route.push("/Dashboard/Discord")}
      >
        <FaArrowLeft className="text-sm" /> Go Back
      </h1>
      <FormComponent methods={methods} submit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-2xl text-blue-600">Worker Information</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="Name" name="name" />
            <MultiSelectFieldElement
              label="earnings"
              name="earnings"
              options={TransactionOptions}
            />
            <div className="flex items-center w-full justify-start">
              <div className="w-fit">
                <ToggleElementComponent label="isActive" name="active" />
              </div>
            </div>
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

export default CreateEditDiscordWorker;

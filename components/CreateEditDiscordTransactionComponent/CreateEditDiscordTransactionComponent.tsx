"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DiscordEarningSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { IFormDiscordEarning } from "@/common/types";
import DropdownFieldElement from "@/common/elements/DropdownElement/DropdownElement";
import NumberFieldElement from "@/common/elements/NumberFieldElement/NumberFieldElement";
import { useGetDiscordWorkers } from "@/queries/DiscordQueries/useGetDiscordWorker/useGetDiscordWorker";
import useEditDiscordTransactionMutation from "@/mutations/DiscordMutations/EditDiscordTransaction";
import useAddDiscordTransactionMutation from "@/mutations/DiscordMutations/CreateDiscordTransaction";

const CreateEditDiscordTransaction = ({
  defaultValues,
  id,
}: {
  defaultValues: IFormDiscordEarning;
  id?: string;
}) => {
  const { data: workers } = useGetDiscordWorkers();
  const route = useRouter();

  const WorkerOptions = workers?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const methods = useForm<IFormDiscordEarning>({
    resolver: yupResolver(DiscordEarningSchema),
    defaultValues,
  });

  const { mutate: createTransaction } = useAddDiscordTransactionMutation();
  const { mutate: EditTransaction } = useEditDiscordTransactionMutation();

  const onSubmit = async (data: IFormDiscordEarning) => {
    if (currentPath.includes("Create")) {
      createTransaction(data);
    } else if (currentPath.includes("Edit") && id) {
      EditTransaction({ id, updatedData: data });
    }
  };

  const currentPath = usePathname();

  return (
    <div className="w-full min-h-full bg-gray-100 p-6 px-14">
      <h1 className="text-6xl text-blue-600">
        {currentPath.includes("create")
          ? "Create Transaction"
          : "Edit Transaction"}
      </h1>
      <h1
        className="text-blue-600 text-lg underline flex items-center gap-2 cursor-pointer"
        onClick={() => route.push("/Dashboard/Discord")}
      >
        <FaArrowLeft className="text-sm" /> Go Back
      </h1>
      <FormComponent methods={methods} submit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-2xl text-blue-600">Model Information</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="lead" name="lead" />
            <TextFieldElementComponent label="createdAt" name="createdAt" />
            <NumberFieldElement name="amount" label="amount" />
            <TextFieldElementComponent label="total" name="total" />
          </div>
          <div className="w-full h-fit gap-9 bg-white p-3 rounded-xl grid grid-cols-2">
            <DropdownFieldElement
              label="status"
              name="status"
              options={[
                { label: "completed", value: "Completed" },
                { label: "hold", value: "Hold" },
                { label: "balance", value: "balance" },
              ]}
            />
            <TextFieldElementComponent label="percentage" name="percentage" />
          </div>
          <h1 className="text-2xl text-blue-600 mt-2">Model Social Media</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <DropdownFieldElement
              label="worker"
              name="workerId"
              options={WorkerOptions}
            />
          </div>
        </div>
        <div className="w-full items-center justify-end flex py-4">
          <button className="bg-blue-600 px-3 py-2 text-xl rounded-xl text-white">
            {currentPath.includes("create")
              ? "Create Transaction"
              : "Edit Transaction"}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CreateEditDiscordTransaction;

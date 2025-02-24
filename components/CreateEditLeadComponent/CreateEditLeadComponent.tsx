"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LeadSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import { usePathname, useRouter } from "next/navigation";
import MultiSelectFieldElement from "@/common/elements/MulitSelectElement/MultiSelectElement";
import { FaArrowLeft } from "react-icons/fa";
import { useGetModels } from "@/queries/useGetModelData/useGetModelData";
import DropdownFieldElement from "@/common/elements/DropdownElement/DropdownElement";
import useEditLeadMutation from "@/mutations/ModelMutations/EditLead";
import useAddLeadMutation from "@/mutations/ModelMutations/CreateLead";
import { IFormLead } from "@/common/types";
import { useGetWorkers } from "@/queries/useGetWorkers/useGetWorkers";
import ToggleElementComponent from "@/common/elements/ToggleElement/ToggleElement";

const CreateEditLeadComponent = ({
  defaultValues,
  id,
}: {
  defaultValues: IFormLead;
  id?: string;
}) => {
  const { data: models } = useGetModels();
  const { data: workers } = useGetWorkers();
  const { mutate: editLead } = useEditLeadMutation();
  const { mutate: createLead } = useAddLeadMutation();
  const route = useRouter();

  const ModelOptions = models?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const WorkerOptions = workers?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const methods = useForm<IFormLead>({
    resolver: yupResolver(LeadSchema),
    defaultValues,
  });

  const onSubmit = async (data: IFormLead) => {
    if (currentPath.includes("create")) {
      createLead(data);
    } else if (currentPath.includes("edit") && id) {
      editLead({ id, updatedData: data });
    }
  };

  const currentPath = usePathname();

  return (
    <div className="w-full min-h-full bg-gray-100 p-6 px-14">
      <h1 className="text-6xl text-blue-600">
        {currentPath.includes("create") ? "Create Lead" : "Edit Lead"}
      </h1>
      <h1
        className="text-blue-600 text-lg underline flex items-center gap-2 cursor-pointer"
        onClick={() => route.push("/Dashboard/Models")}
      >
        <FaArrowLeft className="text-sm" /> Go Back
      </h1>
      <FormComponent methods={methods} submit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-2xl text-blue-600">Lead Information</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="Name" name="name" />
            <TextFieldElementComponent label="Image url" name="img" />
            <TextFieldElementComponent label="Description" name="description" />
          </div>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <MultiSelectFieldElement
              label="model"
              name="modelId"
              options={ModelOptions}
            />
            <DropdownFieldElement
              label="worker"
              name="workerId"
              options={WorkerOptions}
            />
          </div>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <ToggleElementComponent label="isActive" name="active" />
            <ToggleElementComponent label="isSeen" name="seen" />
          </div>
        </div>
        <div className="w-full items-center justify-end flex py-4">
          <button className="bg-blue-600 px-3 py-2 text-xl rounded-xl text-white">
            {currentPath.includes("create") ? "Create Lead" : "Edit Lead"}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CreateEditLeadComponent;

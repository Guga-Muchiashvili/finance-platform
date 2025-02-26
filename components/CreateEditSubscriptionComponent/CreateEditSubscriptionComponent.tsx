"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubscriptionSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { IFormSubscription } from "@/common/types";
import DropdownFieldElement from "@/common/elements/DropdownElement/DropdownElement";
import useAddSubscriptionMutation from "@/mutations/CommonMutations/CreateSubscription";
import useEditSubscriptionMutation from "@/mutations/CommonMutations/EditSubscription";

const CreateEditSubscriptionComponent = ({
  defaultValues,
  id,
  type,
}: {
  defaultValues: IFormSubscription;
  id?: string;
  type: string;
}) => {
  const route = useRouter();

  const methods = useForm<IFormSubscription>({
    resolver: yupResolver(SubscriptionSchema),
    defaultValues,
  });

  const { mutate: createSubscription } = useAddSubscriptionMutation();
  const { mutate: EditSubscription } = useEditSubscriptionMutation();

  const onSubmit = async (data: IFormSubscription) => {
    const updatedData = {
      ...data,
      type,
    };

    console.log(currentPath, id);
    if (currentPath.includes("Create") || currentPath.includes("create")) {
      createSubscription(updatedData);
    } else if (
      (currentPath.includes("Edit") || currentPath.includes("edit")) &&
      id
    ) {
      console.log("here");
      EditSubscription({ id, updatedData });
    }
  };
  const currentPath = usePathname();

  return (
    <div className="w-full min-h-full bg-gray-100 p-6 px-14">
      <h1 className="text-6xl text-blue-600">
        {currentPath.includes("create") || currentPath.includes("Create")
          ? "Create Subscription"
          : "Edit Subscription"}
      </h1>
      <h1
        className="text-blue-600 text-lg underline flex items-center gap-2 cursor-pointer"
        onClick={() => route.push("/Dashboard/Discord")}
      >
        <FaArrowLeft className="text-sm" /> Go Back
      </h1>
      <FormComponent methods={methods} submit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-2xl text-blue-600">Subscription Information</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <TextFieldElementComponent label="reason" name="reason" />
            <DropdownFieldElement
              label="status"
              name="status"
              options={[
                { label: "Monthly", value: "Monthly" },
                { label: "BeWeekly", value: "BeWeekly" },
                { label: "Daily", value: "Daily" },
                { label: "OneTime", value: "OneTime" },
              ]}
            />
          </div>
          <div className="w-full h-fit gap-9 bg-white p-3 rounded-xl grid grid-cols-2">
            <TextFieldElementComponent label="amount" name="amount" />
            <TextFieldElementComponent label="date" name="date" />
          </div>
        </div>
        <div className="w-full items-center justify-end flex py-4">
          <button className="bg-blue-600 px-3 py-2 text-xl rounded-xl text-white">
            {currentPath.includes("create") || currentPath.includes("Create")
              ? "Create Subscription"
              : "Edit Subscription"}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CreateEditSubscriptionComponent;

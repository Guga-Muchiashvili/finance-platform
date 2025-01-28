"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { modelSchema } from "@/common/schema";
import FormComponent from "@/common/context/FormProvider/FormProvider";
import { IFormModel } from "@/common/types";
import TextFieldElementComponent from "@/common/elements/TextFieldElement/TextFieldElement";
import DropdownFieldElement from "@/common/elements/DropdownElement/DropdownElement";
import { usePathname } from "next/navigation";

const CreateEditModelComponent = () => {
  const methods = useForm<IFormModel>({
    resolver: yupResolver(modelSchema),
  });

  const onSubmit = (data: IFormModel) => {
    console.log("Form Data Submitted: ", data);
  };

  const currentPath = usePathname();

  return (
    <div className="w-full h-full bg-gray-100 p-6 px-14">
      <h1 className="text-6xl text-blue-600">
        {currentPath.includes("create") ? "Create Model" : "Edit Model"}
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
          <h1 className="text-2xl text-blue-600 mt-2">Model Social Media</h1>
          <div className="w-full h-fit gap-9 bg-white grid grid-cols-3 p-3 rounded-xl">
            <TextFieldElementComponent label="telegram" name="telegram" />
            <TextFieldElementComponent label="drive" name="drive" />
            <TextFieldElementComponent label="paypal" name="paypal" />
            <TextFieldElementComponent label="image" name="image" />
            <TextFieldElementComponent label="email" name="email" />
            <TextFieldElementComponent label="password" name="password" />
          </div>
          <h1 className="text-2xl text-blue-600 mt-2">Additional Info</h1>

          <div className="w-full h-fit gap-9 bg-white grid grid-cols-2 p-3 rounded-xl">
            <DropdownFieldElement
              label="workers"
              name="workers"
              options={["sicho", "Kakasha", "vano", "gega", "oto"]}
            />
            <DropdownFieldElement
              label="earnings"
              name="earnings"
              options={["sicho", "Kakasha", "vano", "gega", "oto"]}
            />
          </div>
        </div>
        <div className="w-full items-center justify-end flex py-4">
          <button className="bg-blue-600 px-3 py-2 text-xl rounded-xl text-white">
            {currentPath.includes("create") ? "Create Model" : "Edit Model"}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CreateEditModelComponent;

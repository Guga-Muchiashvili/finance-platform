import {
  IFormDiscordEarning,
  IFormDiscordWorker,
  IFormEarning,
  IFormLead,
  IFormModel,
  IFormSubscription,
  IFormWorker,
} from "@/common/types";
import React from "react";
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";

export interface FormComponentProps<T extends FieldValues> {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
  submit: React.FormEventHandler<HTMLFormElement>;
}

const FormComponent = <
  T extends
    | IFormModel
    | IFormWorker
    | IFormEarning
    | IFormLead
    | IFormDiscordEarning
    | IFormDiscordWorker
    | IFormSubscription
>({
  children,
  methods,
  submit,
}: FormComponentProps<T>) => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={submit}>{children}</form>
    </FormProvider>
  );
};

export default FormComponent;

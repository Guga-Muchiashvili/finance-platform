"use client";
import { IFormSubscription } from "@/common/types";
import dynamic from "next/dynamic";
const CreateEditSubscriptionComponent = dynamic(
  () =>
    import(
      "@/components/CreateEditSubscriptionComponent/CreateEditSubscriptionComponent"
    ),
  { ssr: false }
);

export default function Page() {
  const defaultValues: IFormSubscription = {
    amount: "",
    date: "",
    reason: "",
    status: "",
  };
  return (
    <CreateEditSubscriptionComponent
      defaultValues={defaultValues}
      type="Discord"
    />
  );
}

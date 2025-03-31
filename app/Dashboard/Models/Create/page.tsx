"use client";
import { IFormModel } from "@/common/types";
import dynamic from "next/dynamic";
const CreateEditModelComponent = dynamic(
  () =>
    import("@/components/CreateEditModelComponent/CreateEditModelComponent"),
  { ssr: false }
);

export default function Page() {
  const defaultValues: IFormModel = {
    age: "",
    country: "",
    date: "",
    description: "",
    drive: "",
    email: "",
    image: "",
    name: "",
    password: "",
    telegram: "",
    earnings: [],
    workers: [],
    milestone: "0",
  };
  return <CreateEditModelComponent defaultValues={defaultValues} />;
}

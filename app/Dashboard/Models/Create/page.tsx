"use client";
import dynamic from "next/dynamic";
const CreateEditModelComponent = dynamic(
  () =>
    import("@/components/CreateEditModelComponent/CreateEditModelComponent"),
  { ssr: false }
);

export default function Page() {
  return <CreateEditModelComponent />;
}

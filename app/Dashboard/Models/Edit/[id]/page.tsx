import { fetchModelById } from "@/actions/fetch/fetch";
import { IFormModel, Imodel } from "@/common/types";
import CreateEditModelComponent from "@/components/CreateEditModelComponent/CreateEditModelComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const modelData: Imodel = await fetchModelById(id);

  const defaultValues: IFormModel = {
    age: modelData.age,
    country: modelData.country,
    date: modelData.date,
    description: modelData.description,
    drive: modelData.drive,
    email: modelData.email,
    image: modelData.image,
    name: modelData.name,
    password: modelData.password,
    telegram: modelData.telegram,
    earnings: modelData.earnings,
    workers: modelData.workers,
    milestone: modelData.milestone,
  };

  return (
    <CreateEditModelComponent defaultValues={defaultValues} id={modelData.id} />
  );
}

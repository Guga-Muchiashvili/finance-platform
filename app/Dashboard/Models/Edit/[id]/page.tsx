import { fetchModelById } from "@/actions/fetch/fetch";
import { IFormModel, Imodel } from "@/common/types";
import CreateEditModelComponent from "@/components/CreateEditModelComponent/CreateEditModelComponent";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

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
  };
  return (
    <CreateEditModelComponent defaultValues={defaultValues} id={modelData.id} />
  );
};

export default Page;

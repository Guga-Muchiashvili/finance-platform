import { fetchSubscriptionById } from "@/actions/fetch/fetch";
import { IFormSubscription, ISubscription } from "@/common/types";
import CreateEditSubscriptionComponent from "@/components/CreateEditSubscriptionComponent/CreateEditSubscriptionComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const SubscriptionData: ISubscription = await fetchSubscriptionById(id);

  const defaultValues: IFormSubscription = {
    amount: SubscriptionData.amount,
    date: SubscriptionData.date,
    reason: SubscriptionData.reason,
    status: SubscriptionData.status,
  };

  return (
    <CreateEditSubscriptionComponent
      defaultValues={defaultValues}
      type="Model"
      id={id}
    />
  );
}

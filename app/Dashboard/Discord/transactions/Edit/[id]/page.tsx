import { fetchDiscordTransactionById } from "@/actions/fetch/fetch";
import { IFormDiscordEarning } from "@/common/types";
import CreateEditDiscordTransaction from "@/components/CreateEditDiscordTransactionComponent/CreateEditDiscordTransactionComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const TransactionData = await fetchDiscordTransactionById(id);

  const defaultValues: IFormDiscordEarning = {
    amount: TransactionData.amount,
    createdAt: TransactionData.createdAt,
    lead: TransactionData.lead,
    percentage: TransactionData.percentage,
    status: TransactionData.status,
    total: TransactionData.total,
    workerId: TransactionData.workerId,
  };

  return <CreateEditDiscordTransaction defaultValues={defaultValues} id={id} />;
}

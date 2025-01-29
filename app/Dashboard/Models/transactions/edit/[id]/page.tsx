import { fetchTransactionById } from "@/actions/fetch/fetch";
import { IFormEarning } from "@/common/types";
import CreateEditTransaction from "@/components/CreateEditTransactionComponent/CreateEditTransactionComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const TransactionData = await fetchTransactionById(id);

  const defaultValues: IFormEarning = {
    amount: TransactionData.amount,
    createdAt: TransactionData.createdAt,
    lead: TransactionData.lead,
    modelId: TransactionData.modelId,
    percentage: TransactionData.percentage,
    status: TransactionData.status,
    total: TransactionData.total,
    workerId: TransactionData.workerId,
  };

  return <CreateEditTransaction defaultValues={defaultValues} id={id} />;
}

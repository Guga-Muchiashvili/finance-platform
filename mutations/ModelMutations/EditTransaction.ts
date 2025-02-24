import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormEarning } from "@/common/types";
import { useRouter } from "next/navigation";
import { editTransaction } from "@/actions/fetch/modelsActions";

export default function useEditTransactionMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    IFormEarning,
    Error,
    { id: string; updatedData: IFormEarning }
  >({
    mutationFn: ({ id, updatedData }) => editTransaction(id, updatedData),
    onSuccess: (data: IFormEarning) => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      toast.success("transaction updated successfully");
      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error updating transaction");
      console.error("Error editing transaction:", error.message);
    },
  });
}

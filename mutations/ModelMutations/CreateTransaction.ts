import { IFormEarning } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addTransaction } from "@/actions/fetch/modelsActions";

export default function useAddTransactionMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<IFormEarning, Error, IFormEarning>({
    mutationFn: addTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });

      toast.success("Transaction Created");

      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating transaction");
      console.error("Error adding transaction:", error.message);
    },
  });
}

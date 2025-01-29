import { deleteTransaction } from "@/actions/fetch/modelsActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      toast.success("worker deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ModelDashboardData"] });
    },
    onError: (error: Error) => {
      toast.error("Error deleting worker");
      console.error("Error deleting worker:", error.message);
    },
  });
}

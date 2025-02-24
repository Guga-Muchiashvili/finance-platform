import { deleteWorker } from "@/actions/fetch/modelsActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteWorkerMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteWorker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      toast.success("worker deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ModelDashboardData"] });
    },
    onError: (error: Error) => {
      toast.error("Error deleting worker");
      console.error("Error deleting worker:", error.message);
    },
  });
}

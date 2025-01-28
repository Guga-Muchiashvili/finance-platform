import { deleteModel } from "@/actions/fetch/modelsActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteModelMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ModelDashboardData"] });
    },
    onError: (error: Error) => {
      toast.error("Error deleting model");
      console.error("Error deleting model:", error.message);
    },
  });
}

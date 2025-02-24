import { deleteLead } from "@/actions/fetch/modelsActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteLeadlMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Leads"] });
      toast.success("Lead deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ModelDashboardData"] });
    },
    onError: (error: Error) => {
      toast.error("Error deleting Leadl");
      console.error("Error deleting Lead:", error.message);
    },
  });
}

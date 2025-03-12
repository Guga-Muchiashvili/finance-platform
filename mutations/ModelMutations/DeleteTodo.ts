import { deleteTodo } from "@/actions/fetch/modelsActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteTodolMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Todos"] });
      toast.success("Todo deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ModelDashboardData"] });
    },
    onError: (error: Error) => {
      toast.error("Error deleting Todol");
      console.error("Error deleting Todo:", error.message);
    },
  });
}

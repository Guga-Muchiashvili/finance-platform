import { deleteSubscription } from "@/actions/fetch/dashboardActions/DashboardAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Subscription"] });

      const keysToInvalidate = ["ModelDashboardData", "DiscordDashboardData"];
      keysToInvalidate.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );

      toast.success("Subscription deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Error deleting Subscription");
      console.error("Error deleting Subscription:", error.message);
    },
  });
}

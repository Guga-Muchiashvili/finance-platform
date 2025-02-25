import { deleteDiscordTransaction } from "@/actions/fetch/DiscordActions/DiscordPageActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteDiscordTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteDiscordTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discordTransaction"] });
      toast.success("worker deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["DiscordDashboardData"] });
    },
    onError: (error: Error) => {
      toast.error("Error deleting worker");
      console.error("Error deleting worker:", error.message);
    },
  });
}

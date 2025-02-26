import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormSubscription } from "@/common/types";
import { useRouter } from "next/navigation";
import { editSubscription } from "@/actions/fetch/dashboardActions/DashboardAction";

export default function useEditSubscriptionMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    IFormSubscription,
    Error,
    { id: string; updatedData: IFormSubscription & { type: string } }
  >({
    mutationFn: ({ id, updatedData }) => editSubscription(id, updatedData),
    onSuccess: (data: IFormSubscription) => {
      queryClient.invalidateQueries({ queryKey: ["Subscription"] });
      toast.success("Subscription updated successfully");
      router.push("/Dashboard");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error updating Subscription");
      console.error("Error editing Subscription:", error.message);
    },
  });
}

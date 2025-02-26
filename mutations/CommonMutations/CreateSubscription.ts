import { IFormSubscription } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addSubscription } from "@/actions/fetch/dashboardActions/DashboardAction";

export default function useAddSubscriptionMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    IFormSubscription & { type: string },
    Error,
    IFormSubscription & { type: string }
  >({
    mutationFn: addSubscription,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Subscription"] });

      toast.success("Subscription Created");

      router.push("/Dashboard");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating Subscription");
      console.error("Error adding Subscription:", error.message);
    },
  });
}

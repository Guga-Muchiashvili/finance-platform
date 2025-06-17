import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateWorkerPercentage } from "@/actions/fetch/modelsActions";

interface MutationArgs {
  id: string;
  updatedData: {
    percentage: number;
  };
}

export default function useEditPercentageMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    { id: string; workerId: string; percentage: number },
    Error,
    MutationArgs
  >({
    mutationFn: ({ id, updatedData }) =>
      updateWorkerPercentage({ id, percentage: updatedData.percentage }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workerPercentages"] });
      toast.success("Percentage updated successfully");
      router.push("/Dashboard/Models");
    },

    onError: (error) => {
      toast.error("Error updating percentage");
      console.error("Error editing percentage:", error.message);
    },
  });
}

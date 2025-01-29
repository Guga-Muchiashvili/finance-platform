import { IFormWorker } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addWorker } from "@/actions/fetch/modelsActions";

export default function useAddWorkerMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<IFormWorker, Error, IFormWorker>({
    mutationFn: addWorker,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });

      toast.success("Worker Created");

      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating worker");
      console.error("Error adding worker:", error.message);
    },
  });
}

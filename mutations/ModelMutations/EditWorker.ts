import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormWorker } from "@/common/types";
import { useRouter } from "next/navigation";
import { editWorker } from "@/actions/fetch/modelsActions";

export default function useEditWorker() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    IFormWorker,
    Error,
    { id: string; updatedData: IFormWorker }
  >({
    mutationFn: ({ id, updatedData }) => editWorker(id, updatedData),
    onSuccess: (data: IFormWorker) => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      toast.success("Model updated successfully");
      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error updating model");
      console.error("Error editing model:", error.message);
    },
  });
}

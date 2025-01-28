import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormModel } from "@/common/types";
import { editModel } from "@/actions/fetch/modelsActions";
import { useRouter } from "next/navigation";

export default function useEditModelMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    IFormModel,
    Error,
    { id: string; updatedData: IFormModel }
  >({
    mutationFn: ({ id, updatedData }) => editModel(id, updatedData),
    onSuccess: (data: IFormModel) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
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

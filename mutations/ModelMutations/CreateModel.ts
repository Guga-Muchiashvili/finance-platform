import { IFormModel } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addModel } from "@/actions/fetch/modelsActions";

export default function useAddModelMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<IFormModel, Error, IFormModel>({
    mutationFn: addModel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });

      toast.success("Model Created");

      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating model");
      console.error("Error adding model:", error.message);
    },
  });
}

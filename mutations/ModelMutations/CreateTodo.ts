import { IFormTodo } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addTodo } from "@/actions/fetch/modelsActions";

export default function useAddTodoMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<IFormTodo, Error, IFormTodo>({
    mutationFn: addTodo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Todo"] });

      toast.success("Todo Created");

      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating Todo");
      console.error("Error adding Todo:", error.message);
    },
  });
}

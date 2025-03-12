import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormTodo } from "@/common/types";
import { editTodo } from "@/actions/fetch/modelsActions";
import { useRouter } from "next/navigation";

export default function useEditTodoMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<IFormTodo, Error, { id: string; updatedData: IFormTodo }>({
    mutationFn: ({ id, updatedData }) => editTodo(id, updatedData),
    onSuccess: (data: IFormTodo) => {
      queryClient.invalidateQueries({ queryKey: ["Todos"] });
      toast.success("Todo updated successfully");
      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error updating Todo");
      console.error("Error editing Todo:", error.message);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormLead } from "@/common/types";
import { editLead } from "@/actions/fetch/modelsActions";
import { useRouter } from "next/navigation";

export default function useEditLeadMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<IFormLead, Error, { id: string; updatedData: IFormLead }>({
    mutationFn: ({ id, updatedData }) => editLead(id, updatedData),
    onSuccess: (data: IFormLead) => {
      queryClient.invalidateQueries({ queryKey: ["Leads"] });
      toast.success("Lead updated successfully");
      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error updating Lead");
      console.error("Error editing Lead:", error.message);
    },
  });
}

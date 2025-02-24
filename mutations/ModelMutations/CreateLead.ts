import { IFormLead } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createLead } from "@/actions/fetch/modelsActions";

export default function useAddLeadMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<IFormLead, Error, IFormLead>({
    mutationFn: createLead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Lead"] });

      toast.success("Lead Created");

      router.push("/Dashboard/Models");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating Lead");
      console.error("Error adding Lead:", error.message);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormDiscordEarning } from "@/common/types";
import { useRouter } from "next/navigation";
import { editDiscordTransaction } from "@/actions/fetch/DiscordActions/DiscordPageActions";

export default function useEditDiscordTransactionMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    IFormDiscordEarning,
    Error,
    { id: string; updatedData: IFormDiscordEarning }
  >({
    mutationFn: ({ id, updatedData }) =>
      editDiscordTransaction(id, updatedData),
    onSuccess: (data: IFormDiscordEarning) => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      toast.success("transaction updated successfully");
      router.push("/Dashboard/Discord");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error updating transaction");
      console.error("Error editing transaction:", error.message);
    },
  });
}

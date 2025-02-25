import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IFormDiscordWorker } from "@/common/types";
import { useRouter } from "next/navigation";
import { editDiscordWorker } from "@/actions/fetch/DiscordActions/DiscordPageActions";

export default function useEditDiscordWorkerMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    IFormDiscordWorker,
    Error,
    { id: string; updatedData: IFormDiscordWorker }
  >({
    mutationFn: ({ id, updatedData }) => editDiscordWorker(id, updatedData),
    onSuccess: (data: IFormDiscordWorker) => {
      queryClient.invalidateQueries({ queryKey: ["discordWorkers"] });
      toast.success("Worker updated successfully");
      router.push("/Dashboard/Discord");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error updating worker");
      console.error("Error editing worker:", error.message);
    },
  });
}

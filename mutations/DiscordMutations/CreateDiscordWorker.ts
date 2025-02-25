import { IFormDiscordWorker } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addDiscordWorker } from "@/actions/fetch/DiscordActions/DiscordPageActions";

export default function useAddDiscordWorkerMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<IFormDiscordWorker, Error, IFormDiscordWorker>({
    mutationFn: addDiscordWorker,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["discordWorkers"] });
      toast.success("Worker Created");
      router.push("/Dashboard/Discord");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating worker");
      console.error("Error adding worker:", error.message);
    },
  });
}

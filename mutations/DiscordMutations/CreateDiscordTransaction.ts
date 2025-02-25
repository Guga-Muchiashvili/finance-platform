import { IFormDiscordEarning } from "@/common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addDiscordTransaction } from "@/actions/fetch/DiscordActions/DiscordPageActions";

export default function useAddDiscordTransactionMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<IFormDiscordEarning, Error, IFormDiscordEarning>({
    mutationFn: addDiscordTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["discordTransaction"] });

      toast.success("Transaction Created");

      router.push("/Dashboard/Discord");
      return data;
    },
    onError: (error: Error) => {
      toast.error("Error creating transaction");
      console.error("Error adding transaction:", error.message);
    },
  });
}

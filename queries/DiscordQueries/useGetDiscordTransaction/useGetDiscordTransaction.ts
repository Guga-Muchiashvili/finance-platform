import { fetchDiscordTransactions } from "@/actions/fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export const useGetDiscordTransactions = () => {
  return useQuery({
    queryKey: ["discordTransactions"],
    queryFn: () => fetchDiscordTransactions(),
  });
};

import { fetchDiscorWorkers } from "@/actions/fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export const useGetDiscordWorkers = () => {
  return useQuery({
    queryKey: ["discordWorkers"],
    queryFn: () => fetchDiscorWorkers(),
  });
};

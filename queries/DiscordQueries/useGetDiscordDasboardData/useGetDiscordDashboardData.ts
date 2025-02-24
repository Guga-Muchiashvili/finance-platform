import { getDiscordDashboardData } from "@/actions/fetch/DiscordActions/DiscordPageActions";
import { useQuery } from "@tanstack/react-query";

export const useGetDiscordDashboardData = () => {
  return useQuery({
    queryKey: ["DiscordDashboardData"],
    queryFn: () => getDiscordDashboardData(),
  });
};

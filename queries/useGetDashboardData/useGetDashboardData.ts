import { fetchDashboardData } from "@/actions/fetch/dashboardActions/DashboardAction";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: ["DashboardData"],
    queryFn: () => fetchDashboardData(),
  });
};

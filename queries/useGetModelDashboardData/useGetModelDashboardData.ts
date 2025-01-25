import { getModelDashboardData } from "@/actions/fetch/modelsActions";
import { useQuery } from "@tanstack/react-query";

export const useGetModelDashboardData = () => {
  return useQuery({
    queryKey: ["ModelDashboardData"],
    queryFn: () => getModelDashboardData(),
  });
};

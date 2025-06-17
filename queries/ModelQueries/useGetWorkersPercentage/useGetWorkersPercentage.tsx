import { getWorkerPercentages } from "@/actions/fetch/modelsActions";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkersPercentage = () => {
  return useQuery({
    queryKey: ["workersPer"],
    queryFn: () => getWorkerPercentages(),
  });
};

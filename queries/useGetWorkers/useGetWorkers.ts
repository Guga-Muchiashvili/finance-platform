import { fetchWorkers } from "@/actions/fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: () => fetchWorkers(),
  });
};

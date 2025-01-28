import { fetchTransactions } from "@/actions/fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
  });
};

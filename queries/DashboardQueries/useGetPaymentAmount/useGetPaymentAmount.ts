import { calculatePaymentsForAllWorkers } from "@/actions/fetch/modelsActions";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkersSallary = () => {
  return useQuery({
    queryKey: ["PaymentAmount"],
    queryFn: () => calculatePaymentsForAllWorkers(),
  });
};

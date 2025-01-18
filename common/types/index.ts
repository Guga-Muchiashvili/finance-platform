export interface Itransaction {
  id: string;
  amount: number;
  createdAt: string;
  lead: string;
  modelId: string;
  percentage: string;
  status: string;
  total: string;
  workerId: string;
}

export interface INewTransaction {
  id: string;
  amount: string;
  createdAt: string;
  percentage: string;
  status: string;
  total: string;
  workers: string[];
}

import { JsonValue } from "@prisma/client/runtime/library";

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

export interface Imodel {
  id: string;
  age: string;
  country: string;
  date: string;
  description: string;
  drive: string;
  email: string;
  image: string;
  name: string;
  password: string;
  telegram: string;
  workers: string[];
  earnings: string[];
}

export interface IFormModel {
  age: string;
  country: string;
  date: string;
  description: string;
  drive: string;
  email: string;
  image: string;
  name: string;
  password: string;
  telegram: string;
  workers?: string[];
  earnings?: string[];
}

export interface FormElementProps {
  name: string;
  label: string;
}

export interface IFormWorker {
  earnings?: string[];
  modelId: string;
  name: string;
  profit: string;
}

export interface IWorker {
  id?: string;
  earnings: string[];
  modelId: string;
  name: string;
  profit: string;
}

export interface IFormEarning {
  amount: number;
  createdAt: string;
  lead: string;
  modelId: string;
  percentage: string;
  status: string;
  total: string;
  workerId: string;
}

export interface IEarning {
  amount: number;
  createdAt: string;
  lead: string;
  modelId: string;
  percentage: string;
  status: string;
  total: string;
  workerId: string;
  id: string;
}

export interface ILead {
  modelId: string[];
  workerId: string;
  img: string;
  id: string;
  description: string;
  name: string;
  notes: JsonValue;
  active: boolean;
  seen: boolean;
}

export interface IFormLead {
  name: string;
  img: string;
  modelId: string[];
  workerId: string;
  active: boolean;
  seen: boolean;
  description: string;
}

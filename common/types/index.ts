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
  milestone: string;
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
  milestone: string;
}

export interface FormElementProps {
  name: string;
  label: string;
}

export interface IWorker {
  id?: string;
  earnings: string[];
  modelId: string;
  name: string;
  profit: string;
  active: boolean;
  idNumber: string;
  phoneNumber: string;
  email: string;
  transactionAdress: string;
}
export interface IDiscordWorker {
  id?: string;
  earnings: string[];
  name: string;
  active: boolean;
}

export interface IFormWorker {
  earnings?: string[];
  modelId: string;
  name: string;
  profit: string;
  active: boolean;
  idNumber?: string;
  phoneNumber: string;
  email?: string;
  transactionAdress: string;
}

export interface IFormDiscordWorker {
  earnings?: string[];
  name: string;
  active: boolean;
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
export interface IFormDiscordEarning {
  amount: number;
  createdAt: string;
  lead: string;
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
export interface IDiscordEarning {
  amount: number;
  createdAt: string;
  lead: string;
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

export interface ISubscription {
  id: string;
  amount: string;
  reason: string;
  type: string;
  date: string;
  status: string;
}

export interface IFormSubscription {
  amount: string;
  reason: string;
  status: string;
  date: string;
}

export interface IFormTodo {
  title: string;
  description?: string;
  workerId: string[];
  createdAt: string;
  deadline?: string;
  type: string;
  label?: string;
}

export interface ITodo {
  id: string;
  title: string;
  description: string | undefined;
  workerId: string[];
  createdAt: string;
  deadline: string | undefined;
  type: string;
  label: string | undefined;
}

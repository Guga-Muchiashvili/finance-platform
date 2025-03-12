import * as yup from "yup";

export const modelSchema = yup.object().shape({
  age: yup.string().required("Age is required"),
  country: yup.string().required("Country is required"),
  date: yup.string().required("Date is required"),
  description: yup.string().required("Description is required"),
  drive: yup.string().required("Drive is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  image: yup.string().required("Image is required"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  telegram: yup.string().required("Telegram is required"),
  workers: yup.array().of(yup.string().required()),
  earnings: yup.array().of(yup.string().required()),
});

export const workerSchema = yup.object().shape({
  earnings: yup.array().of(yup.string().required()),
  modelId: yup.string().required("Model is required"),
  name: yup.string().required("name is required"),
  profit: yup.string().required("profit is required"),
  active: yup.boolean().required("Active status is required"),
});
export const DiscordworkerSchema = yup.object().shape({
  earnings: yup.array().of(yup.string().required()),
  name: yup.string().required("name is required"),
  active: yup.boolean().required("Active status is required"),
});

export const SubscriptionSchema = yup.object().shape({
  amount: yup.string().required("amount is required"),
  reason: yup.string().required("reason is required"),
  status: yup.string().required("status is required"),
  date: yup.string().required("date is required"),
});

export const EarningSchema = yup.object().shape({
  amount: yup.number().required("amount is required"),
  createdAt: yup.string().required("createdAt is required"),
  lead: yup.string().required("lead is required"),
  modelId: yup.string().required("modelId is required"),
  percentage: yup.string().required("percentage is required"),
  status: yup.string().required("status is required"),
  total: yup.string().required("total is required"),
  workerId: yup.string().required("ModworkerId is required"),
});

export const DiscordEarningSchema = yup.object().shape({
  amount: yup.number().required("amount is required"),
  createdAt: yup.string().required("createdAt is required"),
  lead: yup.string().required("lead is required"),
  percentage: yup.string().required("percentage is required"),
  status: yup.string().required("status is required"),
  total: yup.string().required("total is required"),
  workerId: yup.string().required("ModworkerId is required"),
});

export const LeadSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  img: yup
    .string()
    .url("Image URL is invalid")
    .required("Image URL is required"),
  modelId: yup
    .array()
    .of(yup.string().required("Model ID is required"))
    .min(1, "At least one model ID is required")
    .required("Model is required"),
  workerId: yup.string().required("Worker ID is required"),
  active: yup.boolean().required("Active status is required"),
  seen: yup.boolean().required("Seen status is required"),
  description: yup.string().required("Description is required"),
});

export const todoSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  workerId: yup
    .array()
    .of(yup.string().required())
    .required("Worker IDs are required"),
  createdAt: yup.string().required("Creation date is required"),
  deadline: yup.string(),
  type: yup.string().required("Type is required"),
  label: yup.string(),
});

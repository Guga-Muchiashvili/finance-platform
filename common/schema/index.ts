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
});

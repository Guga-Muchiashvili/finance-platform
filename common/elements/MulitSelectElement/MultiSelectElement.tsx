import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { FormElementProps } from "@/common/types";

const MultiSelectFieldElement: React.FC<
  FormElementProps & { options: { label: string; value: string }[] | undefined }
> = ({ label, name, options }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth margin="normal" error={!!errors[name]}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            multiple
            value={field.value || []}
            onChange={(event) => field.onChange(event.target.value)}
            renderValue={(selected) => (selected as string[]).join(", ")}
            MenuProps={{
              container: document.body,
              disablePortal: true,
            }}
          >
            {options?.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                <Checkbox checked={field.value?.includes(item.value)} />
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Select>
          <p style={{ color: "red", fontSize: "0.8em" }}>
            {errors[name]?.message?.toString() || ""}
          </p>
        </FormControl>
      )}
    />
  );
};

export default MultiSelectFieldElement;

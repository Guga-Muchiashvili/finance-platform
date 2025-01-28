import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormElementProps } from "@/common/types";

const DropdownFieldElement: React.FC<
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
            label={label}
            MenuProps={{
              container: document.body,
              disablePortal: true,
            }}
          >
            {options?.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
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

export default DropdownFieldElement;

import { Button } from "@mui/material";
import React from "react";

import { Input } from "./style";

interface IImageInput {
  onChange: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function ImageInput({ onChange }: IImageInput) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label htmlFor="select_image">
      <Input
        type="file"
        accept="image/"
        id="select_image"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => onChange(e.target?.files[0])}
      />
      <Button variant="contained" color="primary" component="span">
        Adicionar Avatar
      </Button>
    </label>
  );
}
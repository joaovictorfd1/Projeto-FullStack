import { Box, Grid, TextField, Typography, styled } from "@mui/material";

export const ModalContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const ModalContent = styled(Box)`
  width: 100%;
  max-width: 768px;
  border-radius: 8px;
  padding: 24px;
  background-color: white;
  z-index: 200;
`;

export const ModalTitle = styled(Typography)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

export const FormContainer = styled(Grid)`
  width: 100%;
`;

export const Input = styled(TextField)`
  width: 100%;
`;

export const PreviewImage = styled("img")`
  width: 150px;
  height: 150px;
  border-radius: 4px;
  object-fit: cover;
`;
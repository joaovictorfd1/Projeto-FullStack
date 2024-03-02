import { Box, Button, Typography, styled } from "@mui/material";

export const ModalContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const ModalContent = styled(Box)`
  width: 100%;
  max-width: 350px;
  border-radius: 8px;
  padding: 18px;
  background-color: white;
  z-index: 200;
`;

export const Text = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 16px;
`;

export const ConfirmationButton = styled(Button)`
  width: 150px;
  height: 40px;
`;

export const CancelButton = styled(Button)`
  width: 150px;
  height: 40px;
`;
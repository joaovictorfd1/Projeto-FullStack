import { Backdrop, Modal, Stack } from "@mui/material";

import {
  CancelButton,
  ConfirmationButton,
  ModalContainer,
  ModalContent,
  Text,
} from "./styles";

interface IConfirmationModal {
  open: boolean;
  handleClose: VoidFunction;
  message?: string;
  confirmAction: VoidFunction;
  cancelAction: VoidFunction;
}

export default function ConfirmationModal({
  open,
  handleClose,
  message = "Tem certeza que deseja deletar esse curso?",
  confirmAction,
  cancelAction,
}: IConfirmationModal) {
  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <ModalContainer>
        <ModalContent>
          <Stack>
            <Text>{message}</Text>
            <Stack flexDirection="row" gap={2}>
              <ConfirmationButton
                variant="contained"
                onClick={() => confirmAction()}
              >
                Confirmar
              </ConfirmationButton>
              <CancelButton
                variant="outlined"
                color="error"
                onClick={() => cancelAction()}
              >
                Cancelar
              </CancelButton>
            </Stack>
          </Stack>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}
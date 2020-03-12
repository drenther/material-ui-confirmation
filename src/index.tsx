import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  ButtonProps,
  DialogProps,
} from '@material-ui/core';

const noop = (_x?: any) => {};
type Noop = typeof noop;

enum DialogActionTypes {
  OpenDialog = 'open',
  CloseDialog = 'close',
}

interface DialogActionPayload {
  title: string;
  body: React.ReactNode;
  dialogProps?: DialogProps;
  onAccept?: Noop;
  onDecline?: Noop;
  acceptText?: string;
  declineText?: string;
  declineButtonProps?: ButtonProps;
  acceptButtonProps?: ButtonProps;
}

type DialogAction =
  | {
      type: DialogActionTypes.OpenDialog;
      payload: DialogActionPayload;
    }
  | { type: DialogActionTypes.CloseDialog };

interface DialogState extends DialogActionPayload {
  open: boolean;
}

const initialState = {
  open: false,
  title: '',
  body: '',
};

function reducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case DialogActionTypes.OpenDialog:
      return { open: true, ...action.payload };
    case DialogActionTypes.CloseDialog:
      return { ...state, open: false };
    default:
      return state;
  }
}

const ConfirmationDialogContext = React.createContext({
  getConfirmation: noop,
});

export const ConfirmationDialogProvider: React.FC = ({ children }) => {
  const [dialogState, dispatch] = React.useReducer(reducer, initialState);
  const closeDialog = () => {
    dispatch({ type: DialogActionTypes.CloseDialog });
  };
  const openDialog = (payload: DialogActionPayload) => {
    dispatch({ type: DialogActionTypes.OpenDialog, payload });
  };

  return (
    <ConfirmationDialogContext.Provider value={{ getConfirmation: openDialog }}>
      {children}
      <Dialog
        {...dialogState.dialogProps}
        open={dialogState.open}
        onClose={closeDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">{dialogState.title}</DialogTitle>
        <DialogContent id="confirmation-dialog-description">
          {typeof dialogState.body === 'string' ? (
            <DialogContentText>{dialogState.body}</DialogContentText>
          ) : (
            dialogState.body
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="default"
            {...(dialogState.declineButtonProps || {})}
            onClick={() => {
              dialogState.onDecline && dialogState.onDecline();
              closeDialog();
            }}
          >
            {dialogState.declineText || 'No'}
          </Button>
          <Button
            color="primary"
            autoFocus
            {...(dialogState.acceptButtonProps || {})}
            onClick={() => {
              dialogState.onAccept && dialogState.onAccept();
              closeDialog();
            }}
          >
            {dialogState.acceptText || 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationDialogContext.Provider>
  );
};

export type ConfirmationDialogAction = {
  getConfirmation: (props: DialogActionPayload) => void;
};

export function useConfirmationDialog(): ConfirmationDialogAction {
  return React.useContext(ConfirmationDialogContext);
}

import * as React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

const noop = (_x?: any) => {};

type ActionFn =
  | ((toggleBtnsEnabled: React.Dispatch<React.SetStateAction<boolean>>) => void)
  | ((toggleBtnsEnabled: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>);

enum DialogActionTypes {
  OpenDialog = 'open',
  CloseDialog = 'close',
}

interface DialogActionPayload {
  title: string;
  body: React.ReactNode;
  dialogProps?: DialogProps;
  onAccept?: ActionFn;
  onDecline?: ActionFn;
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

  const [btnsEnabled, toggleBtnsEnabled] = React.useState(true);

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
            disabled={!btnsEnabled}
            onClick={async () => {
              toggleBtnsEnabled(false);
              dialogState.onDecline && (await dialogState.onDecline(toggleBtnsEnabled));
              closeDialog();
            }}
          >
            {dialogState.declineText || 'No'}
          </Button>
          <Button
            color="primary"
            autoFocus
            {...(dialogState.acceptButtonProps || {})}
            disabled={!btnsEnabled}
            onClick={async () => {
              toggleBtnsEnabled(false);
              dialogState.onAccept && (await dialogState.onAccept(toggleBtnsEnabled));
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

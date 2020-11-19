import * as React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';

const noop = (_x?: any) => {};

interface HandlerFnParams {
  resetState: () => void;
  closeDialog: () => void;
}

type HandlerFn = ((params: HandlerFnParams) => void) | ((params: HandlerFnParams) => Promise<void>);

enum DialogActionTypes {
  OpenDialog = 'open',
  CloseDialog = 'close',
}

interface DialogActionPayload {
  title: string;
  body: React.ReactNode;
  dialogProps?: DialogProps;
  onAccept?: HandlerFn;
  onDecline?: HandlerFn;
  acceptText?: string;
  declineText?: string;
  declineButtonProps?: ButtonProps;
  acceptButtonProps?: ButtonProps;
  enableBusyAdorment?: boolean;
  busyAdornmentProps?: CircularProgressProps;
  disableButtonAfterAction?: boolean;
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

  const [btnsEnabled, setBtnsEnabled] = React.useState(true);
  const [btnPressed, setBtnPressed] = React.useState<null | 'accept' | 'decline'>(null);

  const resetState = React.useCallback(() => {
    setBtnPressed(null);
    setBtnsEnabled(true);
  }, []);
  const closeDialog = React.useCallback(() => {
    dispatch({ type: DialogActionTypes.CloseDialog });
    resetState();
  }, []);
  const openDialog = React.useCallback((payload: DialogActionPayload) => {
    dispatch({ type: DialogActionTypes.OpenDialog, payload });
  }, []);

  const acceptBtnProps = React.useMemo<ButtonProps>(
    () => ({
      ...(dialogState.declineButtonProps || {}),
      ...(dialogState.disableButtonAfterAction && { disabled: !btnsEnabled }),
      ...(dialogState.enableBusyAdorment && {
        startIcon:
          btnPressed === 'accept' ? (
            <CircularProgress size={15} {...dialogState.busyAdornmentProps} />
          ) : null,
      }),
    }),
    [
      dialogState.acceptButtonProps,
      dialogState.enableBusyAdorment,
      dialogState.disableButtonAfterAction,
      btnPressed,
      btnsEnabled,
    ],
  );
  const onAccept = React.useCallback(async () => {
    if (dialogState.onAccept) {
      await dialogState.onAccept({ resetState, closeDialog });
    }
    closeDialog();
  }, [dialogState.onAccept]);

  const declineBtnProps = React.useMemo(
    () => ({
      ...(dialogState.declineButtonProps || {}),
      ...(dialogState.disableButtonAfterAction && { disabled: !btnsEnabled }),
      ...(dialogState.enableBusyAdorment && {
        startIcon:
          btnPressed === 'decline' ? (
            <CircularProgress size={15} {...dialogState.busyAdornmentProps} />
          ) : null,
      }),
    }),
    [
      dialogState.declineButtonProps,
      dialogState.enableBusyAdorment,
      dialogState.disableButtonAfterAction,
      btnPressed,
      btnsEnabled,
    ],
  );
  const onDecline = React.useCallback(async () => {
    if (dialogState.onDecline) {
      await dialogState.onDecline({ resetState, closeDialog });
    }
    closeDialog();
  }, [dialogState.onDecline]);

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
          <Button color="default" {...acceptBtnProps} onClick={onAccept}>
            {dialogState.declineText || 'No'}
          </Button>
          <Button color="primary" autoFocus {...declineBtnProps} onClick={onDecline}>
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

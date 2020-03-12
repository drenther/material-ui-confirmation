import React from 'react';

import { useConfirmationDialog } from 'material-ui-confirmation';

const App = () => {
  const { getConfirmation } = useConfirmationDialog();

  return (
    <button
      onClick={() => {
        getConfirmation({
          title: 'Is it working?',
          body: "Let's check if it is working",
          onAccept: () => {
            alert('Accepted');
          },
          onDecline: () => {
            alert('Declined');
          },
          dialogProps: {
            disableBackdropClick: true,
          },
          acceptButtonProps: {
            autoFocus: false,
            variant: 'contained',
          },
          declineText: 'Leave me alone',
        });
      }}
    >
      Confirm
    </button>
  );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import { ConfirmationDialogProvider } from 'material-ui-confirmation';

import App from './App';

ReactDOM.render(
  <ConfirmationDialogProvider>
    <App />
  </ConfirmationDialogProvider>,
  document.getElementById('root'),
);

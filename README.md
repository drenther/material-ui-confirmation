# material-ui-confirmation

> React hook to seamlessly use customizable confirmation dialogs from @material-ui/core without managing any open/close state

[![NPM](https://img.shields.io/npm/v/material-ui-confirmation.svg)](https://www.npmjs.com/package/material-ui-confirmation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save material-ui-confirmation
```

```bash
yarn add material-ui-confirmation
```

## Usage

Wrap your app with the `ConfirmationDialogProvider`

```tsx
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
```

Then use the `useConfirmationDialog` hook anywhere down the line

```jsx
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
```

## API Reference

Coming Soon

## License

MIT © [drenther](https://github.com/drenther)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).

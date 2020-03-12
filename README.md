# material-ui-confirmation

> React hook to seamlessly use customizable confirmation dialogs from @material-ui/core without managing any open/close state

[![NPM](https://img.shields.io/npm/v/material-ui-confirmation.svg)](https://www.npmjs.com/package/material-ui-confirmation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save material-ui-confirmation
```

## Usage

```tsx
import * as React from 'react'

import { useMyHook } from 'material-ui-confirmation'

const Example = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
```

## License

MIT © [drenther](https://github.com/drenther)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).

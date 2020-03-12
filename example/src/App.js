import React from 'react'

import { useMyHook } from 'material-ui-confirmation'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App

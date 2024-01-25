import { useState } from 'react'
import extensionLogo from '../assets/icon_512.png'
import crmLogo from '../assets/clientar_logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.clientarcrm.com.br/" target="_blank">
          <img src={crmLogo} className="logo dark" alt="CRM logo" />
        </a>
        <a href="https://www.clientarcrm.com.br/" target="_blank">
          <img src={extensionLogo} className="logo react" alt="Extension logo" />
        </a>
      </div>
      <h1>Extensão do Chrome para o Clientar CRM</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Seja bem-vindo!
        </p>
      </div>
      <p className="read-the-docs">
        Clique nos logos da Clientar CRM e Extensão para saber mais.
      </p>
    </>
  )
}

export default App

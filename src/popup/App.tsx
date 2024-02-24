import { useState, useEffect } from 'react'
import { Button } from '../components/Button'

function App() {
  const [openExtension, setOpenExtension] = useState(true)

  useEffect(() => {    
    startUpRoll();
  }, []);

  const startUpRoll = async () => {
    const result = await chrome.storage.local.get("AppExtOpen")
    const openExt = result ? result.AppExtOpen : null

    if(openExt == null || openExt == true){
      setOpenExtension(true)
    }else{
      setOpenExtension(false)     
    }
  }

  const handlerClickToggleExtension = () => {
    const toggle = !openExtension
    setOpenExtension(toggle)    
    chrome.storage.local.set({"AppExtOpen": toggle })
  }

  const handlerRestartExtension = () => {
    chrome.runtime.reload()
  }

  return (
    <div className="w-[120px] flex flex-col px-2 py-4 gap-2 bg-slate-50">
      {/* <span className='text-gray-800'>Clientar CRM - Extensão para o WhatsApp Web</span> */}
      <Button id="toggleExtension" onClick={handlerClickToggleExtension}>
      {openExtension ? "Fechar" : "Abrir"}
      </Button>
      <Button id="toggleExtension" typeButton='danger' onClick={handlerRestartExtension}>Reiniciar</Button>
    </div>
  )
}

export default App
// function App() {
//   const [count, setCount] = useState(0)
//   return (
//     <>
//       <div>
//         <a href="https://www.clientarcrm.com.br/" target="_blank">
//           <img src={crmLogo} className="logo dark" alt="CRM logo" />
//         </a>
//         <a href="https://www.clientarcrm.com.br/" target="_blank">
//           <img src={extensionLogo} className="logo react" alt="Extension logo" />
//         </a>
//       </div>
//       <h1>Extensão do Chrome para o Clientar CRM</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Seja bem-vindo!
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Clique nos logos da Clientar CRM e Extensão para saber mais.
//       </p>
//     </>
//   )
// }

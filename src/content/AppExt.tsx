import React, {useState,useEffect} from "react";
import ReactDOM from "react-dom/client";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { ShowText } from "../components/ShowText";
import { queryAsync } from "../shared/queryAsync";
import CheckboxStyle from "../components/CheckboxStyle";

export function AppExt(): React.ReactElement {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectMsgs, setSelectMsgs] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if(selectMsgs){
      setErrorMsg(null)
    }       
  }, [selectMsgs])
  
  const copyAction = async () => {
      const copyText = await queryAsync('._11JPr.selectable-text.copyable-text');//document.querySelector('._11JPr.selectable-text.copyable-text')
      if(copyText && copyText.textContent){
        navigator.clipboard.writeText(copyText.textContent);
        const clipText = await navigator.clipboard.readText()
        setCopiedText(clipText)
        // console.log('read clip text ->>', clipText)
        // console.log('copyText ->>', copyText.textContent)
        setSelectMsgs(false)
      }       
  }

  const getText = () => {
    console.log('GET TEXT!! ')
  }

  const createContainerCheckBox = (parent:HTMLElement) => {
    const root = document.createElement("div");
    root.id = "crx-root-chkbx";
    parent.appendChild(root);

    parent.style.setProperty("display", "flex", 'important') 
    parent.style.setProperty("align-items", "center", 'important')       
    parent.style.setProperty("justify-content", "flex-start", 'important')       

    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <CheckboxStyle checked={false} onChange={getText}/>
      </React.StrictMode>
    );
  }

  const injectCheckbox = async (parent:HTMLElement) => {
    console.log('parent obj -> ', parent.id)

    const rowsChats = document.querySelectorAll('#main [role="application"] [role="row"]')
    rowsChats.forEach((row) => {
      createContainerCheckBox(row as HTMLElement)
    });

    
  }

  const showSelectMessages = async() => {
    const chatArea = await queryAsync("#main")as HTMLElement;    
    if(chatArea){
      setSelectMsgs(true)
      injectCheckbox(chatArea)
    }{
      setErrorMsg('Entre em uma conversa para selecionar as mensagens.')
    }
  }

  return (
    <>
      <Container>
      {selectMsgs ? 
      (<Button id="copyButton" onClick={copyAction} >Copiar as mensagens</Button>) 
      :
      (<Button id="selectMsgBtn" onClick={showSelectMessages} >Selecionar mensagens</Button>)
      }
      {errorMsg && (<span className="text-sm text-pretty text-red-500 tracking-wide">{errorMsg}</span>) }

      <ShowText id="output" >{copiedText}</ShowText>        
      </Container>
    </>
  )
}
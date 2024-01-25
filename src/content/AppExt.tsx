import React, {useState,useEffect} from "react";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { ShowText } from "../components/ShowText";
import { queryAsync } from "../shared/queryAsync";

export function AppExt(): React.ReactElement {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectMsgs, setSelectMsgs] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if(!selectMsgs){
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

  const injectCheckbox = async () => {
    const ele = await queryAsync('._11JPr.selectable-text.copyable-text')
    
    console.log('obj -> ', ele)
}

  const showSelectMessages = async() => {
    const chatArea = await queryAsync("#main"); //document.querySelector('#main')
    console.log('TEM CHAT AREA? ->', chatArea)
    if(chatArea){
      setSelectMsgs(true)
      injectCheckbox()
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
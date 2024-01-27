import React, {useState,useEffect} from "react";
import ReactDOM from "react-dom/client";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { ShowText } from "../components/ShowText";
import CheckboxStyle from "../components/CheckboxStyle";
import { generateID } from "../shared/generateID";

interface MessageObject {
  title:string | null | undefined,
  message: string | null | undefined
}

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
      const copyText = document.querySelector('._11JPr.selectable-text.copyable-text')
      if(copyText && copyText.textContent){
        navigator.clipboard.writeText(copyText.textContent);
        const clipText = await navigator.clipboard.readText()
        setCopiedText(clipText)
        // console.log('read clip text ->>', clipText)
        // console.log('copyText ->>', copyText.textContent)
        setSelectMsgs(false)
      }       
  }

  const getText = async (id: string, checked: boolean) => {
    console.log('GET TEXT!! ', id, checked)

    const msgObj:MessageObject = {
      title: null,
      message: null
    }

    const selectorCopyableText = '[extapp="'+"ext-"+ id + '"] .copyable-text';
    const copyableTextNodes = document.querySelectorAll(selectorCopyableText)
    console.log('> copyableTextNodes ->', copyableTextNodes)

    copyableTextNodes.forEach((node) => {  
      if(node.nodeName == 'DIV'){
        msgObj.title = node.attributes.getNamedItem('data-pre-plain-text')?.value;        
      }
      if(node.localName == 'span'){
        msgObj.message = node.textContent 
        const span = node.firstChild as HTMLElement
        const text = span.innerHTML
        
        // console.log('firstChild html > ', firstChild.innerHTML);        
        for (const child of span.children) {
          
        }

        // const children = node.children;
        // console.log('filhos do NODE span > ' ,children);
      }
      if(node.tagName=="IMG"){
        msgObj.message += " - "+node.attributes.getNamedItem('data-plain-text')?.value;
      }
    })
    console.log('THIS TEXT ->', msgObj.title, msgObj.message)
  }


  const createContainerCheckBox = (parent:HTMLElement, uniqueID:string) => {
    const root = document.createElement("div");
    root.id = "crx-root-chkbx";
    parent.appendChild(root);

    parent.style.setProperty("display", "flex", 'important') 
    parent.style.setProperty("align-items", "center", 'important')       
    parent.style.setProperty("justify-content", "flex-start", 'important')       

    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <CheckboxStyle id={uniqueID} checked={false} onChange={getText}/>
      </React.StrictMode>
    );
  }

  const showSelectMessages = async() => {
    const rowsChats = document.querySelectorAll('#main [role="application"] [role="row"]')    
    if(rowsChats){
      setSelectMsgs(true)
      rowsChats.forEach((row) => {      
        row.querySelector('#crx-root-chkbx')?.remove() //remove duplicate items.
        
        const uniqueID = generateID();
        row.setAttribute("extapp", "ext-"+uniqueID)

        createContainerCheckBox(row as HTMLElement, uniqueID)
      });    
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
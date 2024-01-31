/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState,useEffect} from "react";
import ReactDOM from "react-dom/client";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { ShowText } from "../components/ShowText";
import CheckboxStyle from "../components/CheckboxStyle";
import { generateID } from "../shared/generateID";
import { IMessageObject } from "../shared/IMessageObject";
import { sortMessages } from "../shared/sortMessages";


export function AppExt(): React.ReactElement {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectMsgs, setSelectMsgs] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessageObject[]>([]);
  
  useEffect(() => {
    if(selectMsgs){
      setErrorMsg(null)
    }       
  }, [selectMsgs])

  const addMessage = (messageObject: IMessageObject) => {    
    setMessages(old => [...old, messageObject]);
  };
  const removeMessage = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
  };
  
  const replaceEmoticon = async (text: string | null, altValue: string | undefined): Promise<string | null> => {                
    if(!altValue){
      return text
    }
    if(!text){
      return text
    }
    return new Promise((resolve, reject) => {
      try {
        const newText = text.replace(
          /<img[^>]*?alt="(.+?)"[^>]*?>/i,
          (match, alt) => {
            if (alt === altValue) {
              return ` ${altValue} `;
            } else {
              return match;
            }
          },
        );
        resolve(newText); 
    } catch (error) {
      reject(error); 
    }
    });
  }

  const replaceLinkSource = async (text: string | null, hrefValue: string | undefined): Promise<string | null> => {    
    if (!hrefValue) {
      return text;
    }
    if (!text) {
      return text;
    }
    //v1 /<a[^>]*?\s*href="(.+?)"[^>]*?>\.*?<\/a>/i
    //v2 `/<a[^>]*?\s*href="(.+?)"[^>]*?>\s*\n?\s*(?:.*?)</a>/i`

    return new Promise((resolve, reject) => {
      try {
        const newText = text.replace(/<a[^>]*?\s*href="(.+?)"[^>]*?>\s*\n?\s*(?:.*?)<\/a>/i,
            (match, href) => {
            console.log('o que tem aqui: ', match, href);
            if (href.trim() === hrefValue.trim()) {
              return ` ${hrefValue.trim()} `;
            } else {
              return match;
            }
          }
        );
        resolve(newText);
      } catch (error) {
        reject(error);
      }
    });
  };
  
  const copyAction = async () => {  
      if(messages && messages.length > 0){
        const messagesOrdered = await sortMessages(messages)
        console.log('-->> messages Ordered ', messagesOrdered)
        
        let fullText =  ''
        messagesOrdered.forEach((item:any, index:any) => { 
          if(index>0){
            fullText +=  item.title+' '+item.message + '\n'
          }else{
            fullText =  item.title+' '+item.message + '\n'
          }          
        });        
        navigator.clipboard.writeText(fullText);
        const clipText = await navigator.clipboard.readText()
        if(clipText){
          setCopiedText(clipText)        
          removeSelectMessages()
        }        
      }       
  }

  const getText = async (id: string, checked: boolean) => { 
    if(!checked){
      removeMessage(id)
      
    }else{  
      const msgObj:IMessageObject = {
        id: id,
        title: null,
        message: null
      }
      const selectorCopyableText = '[extapp="'+"ext-"+ id + '"] .copyable-text';
      const copyableTextNodes = document.querySelectorAll(selectorCopyableText)    
      console.log('copyableTextNodes -> ', copyableTextNodes)

      copyableTextNodes.forEach(async (node) => {  
        if(node.nodeName == 'DIV'){
          msgObj.title = node.attributes.getNamedItem('data-pre-plain-text')?.value;        
        }
        if(node.localName == 'span'){
          const spanText = node.firstChild as HTMLElement
          msgObj.message = spanText.innerHTML
          
          for (let index = 0; index < spanText.children.length; index++) {
            const child = spanText.children[index] as HTMLElement
            if(child.tagName=="IMG" ){
              const altAttribute = child.attributes.getNamedItem('alt')?.value;            
              msgObj.message = await replaceEmoticon(msgObj.message, altAttribute)                                    
            }
            if(child.tagName=="A" ){
              console.log('A tags -> ', child)
              const hrefAttribute = child.attributes.getNamedItem('href')?.value;                          
              msgObj.message = await replaceLinkSource(msgObj.message, hrefAttribute)  

              console.log('href A -> ', hrefAttribute)
              console.log('msgObj.message -> ', msgObj.message)
            }
          }
          
        }
      })
      addMessage(msgObj) 
    }   
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

  const removeSelectMessages = () => {
    const rowsChats = document.querySelectorAll('#main [role="application"] [role="row"]')    
    if(rowsChats){
      setSelectMsgs(false)
      setMessages([])
      rowsChats.forEach((row) => {      
        row.querySelector('#crx-root-chkbx')?.remove()              
      });    
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
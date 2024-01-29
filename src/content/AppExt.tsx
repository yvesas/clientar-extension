import React, {useState,useEffect} from "react";
import ReactDOM from "react-dom/client";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { ShowText } from "../components/ShowText";
import CheckboxStyle from "../components/CheckboxStyle";
import { generateID } from "../shared/generateID";
import { IMessageObject } from "../shared/IMessageObject";
// import { sortMessages } from "../shared/sortMessages";



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
    // setMessages([...messages, messageObject]);
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
  
  const copyAction = async () => {
    console.log('Array Messages: ', messages)     

      if(messages && messages.length > 0){
        // const messagesOrdered = await sortMessages(messages)
        // console.log('--> qual messagesOrdered? ', messagesOrdered)
        let fullText =  ''
        messages.forEach((item, index) => { 
          if(index>0){
            fullText +=  item.title+' '+item.message + '\n'
          }else{
            fullText =  item.title+' '+item.message + '\n'
          }          
        });
        console.log('--> qual fullText? ', fullText)
        navigator.clipboard.writeText(fullText);
        const clipText = await navigator.clipboard.readText()
        setCopiedText(clipText)
        console.log('--> vai setSelectMsgs?')
        setSelectMsgs(false)
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState} from "react";
import ReactDOM from "react-dom/client";
import { ButtonClip } from "../components/ButtonClip";

export function AppExtCRM(): React.ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);

  // useEffect(() => {
  //     console.log('>> CALL useEffect')
  // }, [isFirstRender])

  const validateClipTextIsWpp = (text:string) => {
      const regex = /\[(\d+):(\d+), (\d+)\/(\d+)\/(\d+)\]/g;
      const matches = text.match(regex);
      if(matches && matches.length>0){
        return true
      }else{
        return false
      }
  }
  
  const removeClipButtons = () => {
    const elements = document.querySelectorAll('#crx-root-btn')  
    if(elements){
      elements.forEach((ele) => {      
        ele?.remove()              
      });    
    }
  }

  const clipMessage = async () => {
    const clipText = await navigator.clipboard.readText();
    if (clipText && validateClipTextIsWpp(clipText)) {            
      removeClipButtons()
    }
  };
 
  const createContainerButtonClip = () => {
    const commentButtonContainer = document.querySelector("div.editor__button") as HTMLElement;    

    if(commentButtonContainer){ 
      commentButtonContainer.querySelector('#crx-root-btn')?.remove()   
        // const uniqueID = generateID();
        // commentButtonContainer.setAttribute("ext-container", "ext-"+uniqueID)
        const root = document.createElement("div");
        root.id = "crx-root-btn";
        commentButtonContainer.appendChild(root);

        commentButtonContainer.style.setProperty("display", "flex", 'important') 
        commentButtonContainer.style.setProperty("align-items", "center", 'important')       
        commentButtonContainer.style.setProperty("justify-content", "flex-start", 'important')
        commentButtonContainer.style.setProperty("gap", "15px 15px", "important");
        
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <ButtonClip id="clipAction" typeButton="new" onClick={clipMessage} >Colar</ButtonClip>       
          </React.StrictMode>
        );
      }
    }
    
    // const haveNewMessages = async () => {
    //   try{
    //     const clipText = await navigator.clipboard.readText();
    //     if (clipText && validateClipTextIsWpp(clipText)) {      
    //       return true
    //     }else{
    //       return false
    //     }
    //   }catch(err){
    //     return false
    //   }      
    // }        

    const showButtonClip =  async () => {
      const commentButtonContainer = document.querySelector("div.editor__button") as HTMLElement;
      if(commentButtonContainer){
        const clipButton = commentButtonContainer.querySelector('#crx-root-btn')
        if(clipButton){
          return
        // }else if(await haveNewMessages()){
        }else {
          createContainerButtonClip()
        }        
      }
    }
  
  

  // const wantingMessages = () => {
  //   console.log('GO CREATE event mousemove')
  //   document.addEventListener("mousemove", () => {
  //     console.log('CALL event mousemove')
  //     verifyNewMessages()
  //   });
    // chrome.tabs.onActivated.addListener
    // chrome.runtime.onMessage.addListener()
  // }
  // wantingMessages()
  
  const observer = new MutationObserver(() => {    
    showButtonClip()
  });

  const addListeners = () => {
    if(isFirstRender){
      setIsFirstRender(false)
      // chrome.runtime.onMessage.addListener(function(message, sender) {
      //   console.log('>>> CONTENT CRM recebeu! >>> sender:', sender)
      //   if (message.action === "sendTextEXT") {
          
      //     const data = message.message
      //     console.log('>>> CONTENT CRM recebeu! --> ', data)
          
      //   }
      // });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
  addListeners()

  return (
    <>
      {/* <Container>
      <div>{version}</div>
      <Button id="copyButton" onClick={clipMessage} >Colar as mensagens</Button>
        
      <ShowText id="output" >{copiedText}</ShowText>
      <Button id="cancel" typeButton="danger" onClick={cancelAction} >Apagar mensagens</Button>       
      </Container> */}
    </>
  )
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom/client";
import { ButtonClip } from "../components/ButtonClip";

interface AppProps {
  version: string
}

export function AppExtCRM({ version }: AppProps): React.ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    console.log('BUTTON use effect > ', version, isFirstRender)
    // verifyNewMessages()
    // if(isFirstRender){
    //   createContainerButtonClip()
    // }    
  }, [isFirstRender, version])

  const validateClipTextIsWpp = (text:string) => {
    // text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //     [17:16, 28/01/2024] Maecenas sit amet pretium urna.
    //     Fusce aliquam lacus eget neque ultricies, in ullamcorper magna ultricies.
    //     [12:34, 01/02/2024] Cras eget nisi sed lectus pulvinar ullamcorper.
    //     `;
      const regex = /\[(\d+):(\d+), (\d+)\/(\d+)\/(\d+)\]/g;
      const matches = text.match(regex);
      console.log('find matches in clip text: ', matches)
      if(matches && matches.length>0){
        return true
      }else{
        return false
      }
  }
  
  const removeClipButtons = () => {
    const elements = document.querySelectorAll('#crx-root-btn')    
    console.log('>>> Elements for remove -> ', elements)
    if(elements){
      elements.forEach((ele) => {      
        ele?.remove()              
      });    
    }
  }

  const clipMessage = async () => {
    const clipText = await navigator.clipboard.readText();
    console.log('CLIP msg -> ', clipText)
    if (clipText && validateClipTextIsWpp(clipText)) {            
      removeClipButtons()
    }
  };
 
  const createContainerButtonClip = () => {
    const commentButtonContainer = document.querySelector("div.editor__button") as HTMLElement; // get new CRM
    console.log('<><>> commentButtonContainer > ', commentButtonContainer)

    if(commentButtonContainer){        
      commentButtonContainer.querySelector('#crx-root-btn')?.remove() //remove duplicate items.
      
        setIsFirstRender(false)
        // const uniqueID = generateID();
        // commentButtonContainer.setAttribute("ext-container", "ext-"+uniqueID)
        const root = document.createElement("div");
        root.id = "crx-root-btn";
        commentButtonContainer.appendChild(root);

        commentButtonContainer.style.setProperty("display", "flex", 'important') 
        commentButtonContainer.style.setProperty("align-items", "center", 'important')       
        commentButtonContainer.style.setProperty("justify-content", "flex-start", 'important')
        commentButtonContainer.style.setProperty("gap", "15px 15px", "important");
        
        console.log('<><>> CREATE Comp > ', root)

        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <ButtonClip id="clipAction" typeButton="new" onClick={clipMessage} >Colar</ButtonClip>       
          </React.StrictMode>
        );
      }
    }
    createContainerButtonClip()
  
  // const verifyNewMessages = async () => {
  //   const clipText = await navigator.clipboard.readText();
  //   console.log('<><>> verifyNewMessages > ', clipText)
  //   if (clipText && validateClipTextIsWpp(clipText)) {      
  //     createContainerButtonClip()
  //   }
  // }

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

  return (
    <>
    <div>{version}</div>
      {/* <Container>
      <div>{version}</div>
      <Button id="copyButton" onClick={clipMessage} >Colar as mensagens</Button>
        
      <ShowText id="output" >{copiedText}</ShowText>
      <Button id="cancel" typeButton="danger" onClick={cancelAction} >Apagar mensagens</Button>       
      </Container> */}
    </>
  )
}
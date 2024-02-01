/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom/client";
// import { Container } from "../components/Container";
// import { Button } from "../components/Button";
// import { ShowText } from "../components/ShowText";
import { ButtonClip } from "../components/ButtonClip";
// import { generateID } from "../shared/generateID";

interface AppProps {
  version: string
}

export function AppExtCRM({ version }: AppProps): React.ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);
  // const [copiedText, setCopiedText] = useState<string | null>(null);
  // const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    console.log('BUTTON use effect > ', version, isFirstRender)
    verifyNewMessages()
    // if(isFirstRender){
    //   createContainerButtonClip()
    // }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstRender])
 
  const createContainerButtonClip = () => {
    const commentButtonContainer = document.querySelector("div.editor__button") as HTMLElement; // get new CRM
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

        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <ButtonClip id="clipAction" typeButton="new" onClick={clipMessage} >Colar</ButtonClip>       
          </React.StrictMode>
        );
      }
    }
  
  
   
  const validateClipTextIsWpp = (text:string) => {
    // text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //     [17:16, 28/01/2024] Maecenas sit amet pretium urna.
    //     Fusce aliquam lacus eget neque ultricies, in ullamcorper magna ultricies.
    //     [12:34, 01/02/2024] Cras eget nisi sed lectus pulvinar ullamcorper.
    //     `;
      const regex = /\[(\d+):(\d+), (\d+)\/(\d+)\/(\d+)\]/g;
      const matches = text.match(regex);
      // console.log('find matches in clip text: ', matches);

      if(matches && matches.length>0){
        return true
      }else{
        return false
      }
  }


  const verifyNewMessages = async () => {
    const clipText = await navigator.clipboard.readText();
    if (clipText && validateClipTextIsWpp(clipText)) {      
      createContainerButtonClip()
    }
  }

  const removeClipButtons = () => {
    const elements = document.querySelectorAll('#main [role="application"] [role="row"]')    
    if(elements){
      elements.forEach((ele) => {      
        ele.querySelector('#crx-root-btn')?.remove()              
      });    
    }
  }

  const clipMessage = async () => {
    const clipText = await navigator.clipboard.readText();
    console.log('CLIP msg -> ', clipText)
    if (clipText && validateClipTextIsWpp(clipText)) {      
      // setCopiedText(clipText);

      removeClipButtons()
    }
  };

  

  // const cancelAction = () => {    
  //   const output = document.querySelector('#output') ? document.querySelector('#output'):null
  //   if(output)
  //   output.innerHTML = "";
  // }

  createContainerButtonClip()
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ButtonClip } from "../components/ButtonClip";

export interface AppExtCrmProps {
  newVersion: boolean
}

export function AppExtCRM({ newVersion=true }:AppExtCrmProps): React.ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  const validateText = (text: string) => {
    try {
      const regex = /\[(\d+):(\d+), (\d+)\/(\d+)\/(\d+)\]/g;
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Failed validate text. ", err);
    }
  };

  const removeClipButtons = async () => {
    try {
      // navigator.clipboard.writeText("a");
      // const clearClipText = await navigator.clipboard.readText()
      await chrome.storage.local.set({ "clipboard-AppExt": null })
      const elements = document.querySelectorAll("#crx-root-btn");
      if (elements) {
        elements.forEach((ele) => {
          ele?.remove();
        });
      }
    } catch (err) {
      console.error("Failed remove clip button. ", err);
    }
  };

  const clipMessageForNewVersion = async () => {
    try {
      const result = await chrome.storage.local.get("clipboard-AppExt")
      const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []

      if(clipMessages && clipMessages.length>0){
        
        const textArea = document.querySelector(
          "#quill-container div.ql-editor"
        ) as HTMLElement;

        for (const item of clipMessages) {
          if (item.title && validateText(item.title)) {
            const pText = document.createElement("p");
            pText.id= item.id
            pText.innerHTML = item.title + " " + item.message             
            textArea.appendChild(pText)
          }
        }
      }      
    } catch (err) {
      console.error("Failed clip message for new version. ", err);
      return;
    }
  };

  const clipMessageForOldVersion = async () => {
    try {
      const result = await chrome.storage.local.get("clipboard-AppExt")
      const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []

      if(clipMessages && clipMessages.length>0){
        
        const textArea = document.querySelector(
          "#crx-root-container textarea"
        ) as HTMLElement;

        let fullText = "";
        clipMessages.forEach((item: any, index: any) => {
          if (item.title && validateText(item.title)) {
            if (index > 0) {
              fullText += item.title + " " + item.message + "\n";
            } else {
              fullText = item.title + " " + item.message + "\n";
            }
          }
        });
        textArea.innerHTML = fullText
      }      
    } catch (err) {
      console.error("Failed clip message for new version. ", err);
      return;
    }
  };

  const clipMessage = async (e:any) => {
    try {
      e.preventDefault();
      const result = await chrome.storage.local.get("clipboard-AppExt")
      const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []

      if(clipMessages && clipMessages.length>0){
        
        if(newVersion){
          clipMessageForNewVersion()
        }else{
          clipMessageForOldVersion()
        }

        removeClipButtons();
      }      
    } catch (err) {
      console.error("Failed clip message. ", err);
      return;
    }
  };

  const renderComponent = (element:HTMLElement | null) => {    
    if(element){
      const typeButton = newVersion ? "new" : "old"
      ReactDOM.createRoot(element).render(
          <React.StrictMode>
            <ButtonClip id="clipAction" typeButton={typeButton} onClick={clipMessage}>
              Colar
            </ButtonClip>
          </React.StrictMode>
        );
    }
  }

  const getParentContainerButtonClip = (isNewVersion:boolean) => {
    let ButtonContainer = null
    if(isNewVersion){
      ButtonContainer = document.querySelector(
        "div.editor__button") as HTMLElement;
    }else{
      ButtonContainer = document.querySelector(
        "body.main textarea"
        // "#ped_comentario"
        ) as HTMLElement;

      ButtonContainer = ButtonContainer?.parentElement ? ButtonContainer.parentElement : null
    }
    return ButtonContainer
  }

  const createButtonContainer = () => {
    try {
      const hookContainerElement = getParentContainerButtonClip(newVersion)
      if (hookContainerElement) {                             
        if(newVersion){
          createContainerForNewVersion(hookContainerElement)          
        }else{
          createContainerForOldVersion(hookContainerElement)          
        }        
      }
    } catch (err) {
      console.error("Failed create clip button container. ", err);
      return;
    }
  };

  const createContainerForNewVersion = (hookElement:HTMLElement) => {
    try { 
        hookElement.querySelector("#crx-root-btn")?.remove();                   
        const root = document.createElement("div");
        root.id = "crx-root-btn";        
        hookElement.appendChild(root);
        hookElement.style.setProperty(
            "display",
            "flex",
            "important"
          );
          hookElement.style.setProperty(
            "align-items",
            "center",
            "important"
          );
          hookElement.style.setProperty(
            "justify-content",
            "flex-start",
            "important"
          );
          hookElement.style.setProperty(
            "gap",
            "15px 15px",
            "important"
          );
                
        renderComponent(root)
      
    } catch (err) {
      console.error("Failed create container for new version. ", err);
      return;
    }
  }

  const createContainerForOldVersion = (hookElement:HTMLElement) => {
    try{            
          // const parentElement = hookElement.parentElement ? hookElement.parentElement : null
          const parentElement = hookElement
          if(parentElement){ 
            let innerHTML = parentElement.innerHTML
            innerHTML = innerHTML.replace("<textarea","<div id='crx-root-container'><textarea")
            innerHTML = innerHTML.replace("</textarea>","</textarea></div>")
            parentElement.innerHTML = innerHTML
            
            const rootContainer = parentElement.querySelector("#crx-root-container") ? parentElement.querySelector("#crx-root-container") as HTMLElement : null            
            const root = document.createElement("div");
            root.id = "crx-root-btn";
            rootContainer?.appendChild(root);
            rootContainer?.style.setProperty(
              "display",
              "flex",
              "important"
            );
            rootContainer?.style.setProperty(
              "align-items",
              "center",
              "important"
            );
            rootContainer?.style.setProperty(
              "justify-content",
              "flex-start",
              "important"
            );
            rootContainer?.style.setProperty(
              "gap",
              "15px 15px",
              "important"
            );
            renderComponent(root as HTMLElement)
          }
    } catch (err) {
      console.error("Failed create container for old version. ", err);
      return;
    }
  }

  const haveNewMessages = async () => {
    try{
        const result = await chrome.storage.local.get("clipboard-AppExt")
        const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []
          if(clipMessages && clipMessages.length>0){            
            for (const item of clipMessages) {              
              if (item.title && !validateText(item.title)) {
                return false;
              }
            }  
            return true;
          }else{
            return false
          }    
    }catch(err){
      return false
    }
  }

  const showButtonClip = async () => {
    try {
      const ButtonContainer = getParentContainerButtonClip(newVersion)
      
      if (ButtonContainer) {
        const clipButton =
          ButtonContainer.querySelector("#crx-root-btn");
        if (clipButton) {
          return;
        }else if(await haveNewMessages()){
        // } else {
          createButtonContainer();
        }
      }
    } catch (err) {
      console.error("Failed show clip button. ", err);
      return;
    }
  };

  const observer = new MutationObserver(() => {
    // for (const mutation of mutations) {
    //   if (mutation.type === 'childList') {
    //     for (const addedNode of mutation.addedNodes) {
    //       if (addedNode.classList.contains('editor__button')) {
    showButtonClip();
    //       }
    //     }
    //   }
    // }
  });

  const addListeners = () => {
    try {
      if (isFirstRender) {
        setIsFirstRender(false);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
      chrome.storage.onChanged.addListener(
        function(changes) {
          if(changes && changes["clipboard-AppExt"]){
            showButtonClip();
          }
        }
      );
      
    } catch (err) {
      console.error("Failed add listeners. ", err);
    }
  };
  addListeners();

  return (
    <>
      {/* <Container>
      <div>{version}</div>
      <Button id="copyButton" onClick={clipMessage} >Colar as mensagens</Button>
        
      <ShowText id="output" >{copiedText}</ShowText>
      <Button id="cancel" typeButton="danger" onClick={cancelAction} >Apagar mensagens</Button>       
      </Container> */}
    </>
  );
}

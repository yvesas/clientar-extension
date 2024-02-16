/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ButtonClip } from "../components/ButtonClip";
import { generateID } from "../shared/generateID";

export interface AppExtCrmProps {
  newVersion: boolean
}

export function AppExtCRM({ newVersion=true }:AppExtCrmProps): React.ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);

  const removeEmotions = (text:string) => {
      let newText = "";
      for (let i = 0; i < text.length; i++) {
          const noEmotes = /[^\n0-9a-zA-Z'"' '.,áÁãÃâÂàÀéÉêÊíÍóÓõÕôÔúÚçÇ?!:;#()/*\-[\]{}_ªº°=<>+&%$@]/gi;
          // /[^\n0-9a-zA-Z'"' '.,áÁãÃâÂàÀéÉêÊíÍóÓõÕôÔúÚçÇ?!:;#()/*\-\[\]\{\}_ªº°=<>+&%$@]/gi;          
          
          if (text[i].match(noEmotes) == null) {
            newText += text[i];
          }
      }
      console.log('>> old text: ', text)
      console.log('>> new text: ', newText)
      return newText
  }
  
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
      await chrome.storage.local.set({ "clipboard-AppExt": null })
      const elements = document.querySelectorAll("#crx-root-btn");
      if (elements) {
        elements.forEach((ele) => {
          ele?.remove();
        });
      }
      if(!newVersion){
        const hookElements = document.querySelectorAll("#crx-root-container");
        hookElements.forEach((ele) => {
          const parentNode = ele.parentElement ? ele.parentElement : null 
          const textarea = ele.querySelector("textarea") ? ele.querySelector("textarea") : null          
          if(ele && parentNode && textarea){           
            parentNode.insertBefore(textarea, ele);
            ele?.remove();
          }
        })        
      }
    } catch (err) {
      console.error("Failed remove clip button. ", err);
    }
  };

  const clipMessageForNewVersion = async () => {
    try {
      const result = await chrome.storage.local.get("clipboard-AppExt")
      const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []

      if(clipMessages.length>0){
        
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
        return true; 
      }
      return true;       
    } catch (err) {
      console.error("Failed clip message for new version. ", err);
      return false;
    }
  };

  const clipMessageForOldVersion = async (uniqueID:string) => {
    try {
      const result = await chrome.storage.local.get("clipboard-AppExt")
      const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []
      
      if(clipMessages.length>0){
        const textArea = document.querySelector(
          '[extapp="' + "cont-" + uniqueID + '"]'
        ) as HTMLTextAreaElement;

                
        let fullText = textArea.value;
        clipMessages.forEach((item: any, index: any) => {
          if (item.title && validateText(item.title)) {
            const _message = removeEmotions(item.message)

            if (index > 0) {
              fullText += item.title + " " + _message + "\n";
            } else {
              fullText = item.title + " " + _message + "\n";
            }
          }
        });
        
        textArea.value = fullText;
        return true; 
      }
      return true;     
    } catch (err) {
      console.error("Failed clip message for old version. ", err);
      return false;
    }
  };

  const clipMessage = async (e:any, id:string) => {
    try {
      e.preventDefault();
      const uniqueId = id ? id : e.target.id;

      const result = await chrome.storage.local.get("clipboard-AppExt")
      const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []

      if(clipMessages && clipMessages.length>0){
        let finishProcess = false
        if(newVersion){
          finishProcess = await clipMessageForNewVersion()
          if(finishProcess){          
            removeClipButtons();
          }  
        }else{         
          finishProcess = await clipMessageForOldVersion(uniqueId)
          if(finishProcess){          
            removeClipButtons();
          }  
        }              
      }      
    } catch (err) {
      console.error("Failed clip message. ", err);
      return;
    }
  };

  const renderComponent = (element:HTMLElement | null, id:string|null) => {    
    if(element){
      const typeButton = newVersion ? "new" : "old"
      const buttonID = id ? id : "clipAction"

      ReactDOM.createRoot(element).render(
          <React.StrictMode>
            <ButtonClip id={buttonID} typeButton={typeButton} onClick={clipMessage}>
              Colar
            </ButtonClip>
          </React.StrictMode>
        );
    }
  }

  const getParentContainerButtonClipNew = () => {
    let ButtonContainer = null
      ButtonContainer = document.querySelector(
        "div.editor__button") as HTMLElement;    
    return ButtonContainer
  }
  const getParentContainerButtonClipOld = () => {
    const ButtonContainerList = document.querySelectorAll(
        "body.main textarea"
        // "#ped_comentario"
        );
    return ButtonContainerList
  }

  const createButtonContainer = () => {
    try {        
        if(newVersion){
          const hookContainerElement = getParentContainerButtonClipNew()    
          createContainerForNewVersion(hookContainerElement)          
        }else{
          const hookContainerElements = getParentContainerButtonClipOld()
          createContainerForOldVersion(hookContainerElements)          
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
                
        renderComponent(root, null)
      
    } catch (err) {
      console.error("Failed create container for new version. ", err);
      return;
    }
  }

  const createContainerForOldVersion = (hookElements:NodeListOf<Element>) => {
    try{                      
          hookElements.forEach((textarea) => {
          const parentNode = textarea.parentElement ? textarea.parentElement : null          
          if(parentNode){ 
            const uniqueID = generateID();
            textarea.setAttribute("extapp", "cont-" + uniqueID);  

            const rootContainer = document.createElement("div");
            rootContainer.id = "crx-root-container";
            parentNode.insertBefore(rootContainer, textarea);              
            rootContainer.appendChild(textarea) 
             
            const root = document.createElement("div");
            root.id = "crx-root-btn";
            root.setAttribute("extapp", "ext-" + uniqueID);            
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
            
            renderComponent(root as HTMLElement, uniqueID)
          }

        })
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
      if(newVersion){      
        const ButtonContainer = getParentContainerButtonClipNew()      
        if (ButtonContainer) {
          if(await haveNewMessages()){
            const clipButton =
            ButtonContainer.querySelector("#crx-root-btn");
            if (clipButton) {
              return;
            }else {               
              createButtonContainer();  
            }  
          } else {
            removeClipButtons();            
          }
        }
      }else{
        const ButtonContainer = getParentContainerButtonClipOld()      
        if (ButtonContainer) {
          if(await haveNewMessages()){
            const clipButton =
            document.querySelector("#crx-root-btn");
            if (clipButton) {
              return;
            }else {               
              createButtonContainer();  
            }  
          } else {
            removeClipButtons();            
          }
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

        const bodyContainer = document.querySelector("body.main");
        bodyContainer?.addEventListener("mouseover", ()=>{          
          showButtonClip();
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

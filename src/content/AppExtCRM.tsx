/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ButtonClip } from "../components/ButtonClip";

export function AppExtCRM(): React.ReactElement {
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

  const clipMessage = async () => {
    try {
      const result = await chrome.storage.local.get("clipboard-AppExt")
      const clipMessages = result["clipboard-AppExt"] ? result["clipboard-AppExt"] : []

      if(clipMessages && clipMessages.length>0){
        const textArea = document.querySelector(
          "#quill-container div.ql-editor"
        ) as HTMLElement;

        for (const item of clipMessages) {
          if (item.message && !validateText(item.message)) {
            const pText = document.createElement("p");
            pText.id= item.id
            pText.innerHTML = item.title + " " + item.message             
            textArea.appendChild(pText)
          }
        }

        removeClipButtons();
      }      
    } catch (err) {
      console.error("Failed clip message. ", err);
      return;
    }
  };

  const createContainerButtonClip = () => {
    try {
      const commentButtonContainer = document.querySelector(
        "div.editor__button"
      ) as HTMLElement;

      if (commentButtonContainer) {
        commentButtonContainer.querySelector("#crx-root-btn")?.remove();
        // const uniqueID = generateID();
        // commentButtonContainer.setAttribute("ext-container", "ext-"+uniqueID)
        const root = document.createElement("div");
        root.id = "crx-root-btn";
        commentButtonContainer.appendChild(root);

        commentButtonContainer.style.setProperty(
          "display",
          "flex",
          "important"
        );
        commentButtonContainer.style.setProperty(
          "align-items",
          "center",
          "important"
        );
        commentButtonContainer.style.setProperty(
          "justify-content",
          "flex-start",
          "important"
        );
        commentButtonContainer.style.setProperty(
          "gap",
          "15px 15px",
          "important"
        );
        
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <ButtonClip id="clipAction" typeButton="new" onClick={clipMessage}>
              Colar
            </ButtonClip>
          </React.StrictMode>
        );
      }
    } catch (err) {
      console.error("Failed create clip button container. ", err);
      return;
    }
  };

  const haveNewMessages = async () => {
    try{
      // const clipText = await navigator.clipboard.readText();
      // if (clipText && validateText(clipText)) {
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
      const commentButtonContainer = document.querySelector(
        "div.editor__button"
      ) as HTMLElement;
      if (commentButtonContainer) {
        const clipButton =
          commentButtonContainer.querySelector("#crx-root-btn");
        if (clipButton) {
          return;
        }else if(await haveNewMessages()){
        // } else {
          createContainerButtonClip();
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

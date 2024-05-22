/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { ShowText } from "../components/ShowText";
import CheckboxStyle from "../components/CheckboxStyle";
import { generateID } from "../shared/generateID";
import { IMessageObject } from "../shared/IMessageObject";
import { sortMessages } from "../shared/sortMessages";
import { extractListItemText, replaceEmoticon, replaceLinkSource } from "../shared/utils";
import { IMediaObject } from "../shared/IMediaObject";
import { MediaType } from "../shared/MediaType";
import { ShowMediaList } from "../components/ShowMediaList";

export function AppExt(): React.ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSelectAllMsgs, setIsSelectAllMsgs] = useState(false);
  // const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectMsgs, setSelectMsgs] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessageObject[]>([]);
  const [mediaList, setMediaList] = useState<IMediaObject[]>([]);

  useEffect(() => {
    if (selectMsgs) {
      setErrorMsg(null);
    }
  }, [selectMsgs, isFirstRender]);
 
  useEffect(() => {
    async function updateStorage() {
      const messagesOrdered = sortMessages(messages);  
      await chrome.storage.local.set({
        "clipboard-AppExt": messagesOrdered
      });
    }
    updateStorage();
  }, [messages]);

  const addListeners = () => {
    try {
      if (isFirstRender) {
        const menuWpElements = document.querySelectorAll(
          "#app ._aigw"
        );
        if (menuWpElements && menuWpElements.length > 0) {
          menuWpElements.forEach((ele) => {
            ele.addEventListener("click", () => {
              cancelAction()
            });
          });
          setIsFirstRender(false);
        }
        chrome.storage.onChanged.addListener(
          async function(changes) {
            if(changes && changes["clipboard-AppExt"] && changes["clipboard-AppExt"].newValue === 'It was pasted.'){              
              // chrome.storage.local.get("AppExt-Files").then((result)=>{
              //   const files = result["AppExt-Files"];  
              //   console.log('ACINOU o get store -> resultFiles:', files)                   
              //   if(needAGeneralReset(changes["clipboard-AppExt"]?.newValue, files)){              
              //     cancelAction()
              //   }else{
              //     clearDataMessages();
              //   } 
              // })               
              if(await needAGeneralReset()){
                cancelAction()
              }else{
                clearDataMessages(changes["clipboard-AppExt"].oldValue);
              }                   
            } 
            if(changes && changes["AppExt-Files"]){ 
              const newValue =  changes["AppExt-Files"].newValue                       
              
              if(newValue === 'It was uploaded.'){
                if(await needAGeneralReset()){
                  cancelAction()
                }else{
                  clearDataFiles(changes["AppExt-Files"].oldValue);
                }
              }
              console.log('@>> NOVOS FILES', newValue)                   
              if(Array.isArray(newValue)){
                newValue.map((item)=>{
                  updateMediaList(item.id)
                })
              }
            } 
          }
        );        
      }      
    } catch (err) {
      console.log("Failed add listeners. ", err);
    }
  };
  addListeners();

  const addMessage = async(messageObject: IMessageObject) => {
    if (messageObject.id && messageObject.title && messageObject.message) {
      // console.log("@> added new message with obtained text :: ", messageObject.id)
      // console.log("@> Message title: ", messageObject.title)       
      setMessages((old) => [...old, messageObject]);
    }
  };
  const removeMessage = (id: string) => {      
    setMessages((prevMessages) => 
      prevMessages.filter((message) => message.id !== id)
    );
  };
 

  const addMedia = (mediaObject: IMediaObject) => {
    if (mediaObject.id && mediaObject.type && mediaObject.message) {
      // console.log("@> added new media on list :: ", mediaObject.id)
      // console.log("@> Message message: ", mediaObject.message)
      setMediaList((old) => [...old, mediaObject]);
    }
  };
  const removeMedia = (id: string) => {
    setMediaList((prevMedia) =>
      prevMedia.filter((media) => media.id !== id)
    );
  };
  const updateMediaList = (id: string) => {
    console.log("@> updateMediaList - ID:", id)
    setMediaList((prevMedia) =>
      prevMedia.map((media) =>
        media.id === id ? { ...media, downloaded: 1 } : media
      )
    );
  };

  const verifyType = async (id:string) => {
    const isAudioType = document.querySelector('[extapp="' + "ext-" + id + '"] [data-icon="audio-play"]') || 
    document.querySelector('[extapp="' + "ext-" + id + '"] [data-icon="audio-pause"]')
    
    const isTextType = document.querySelector('[extapp="' + "ext-" + id + '"] div .copyable-text')
    const isImageType = document.querySelector('[extapp="' + "ext-" + id + '"] div .UzMP7 .cm280p3y .lhggkp7q img')

    if(isAudioType){
      return 'AUDIO'
    }else if(isTextType){
      return 'TEXT'
    }else if(isImageType){
      return 'SHARED_IMG'
    }
  }

  // const uncheckedHandler = (id: string) => {
  //   // document.getElementById("checkbox").checked = false;
  //   removeMessage(id);
  //   removeMedia(id);
  // }

  const checkboxChangeHandler = async (id: string, checked: boolean) => {
    try {
      console.log("@> click in CheckBox. checked?", checked)
      if (!checked) {
        console.log("@> Unchecked.")
        removeMessage(id);
        removeMedia(id);
      } else {

        const _type = await verifyType(id)
        if(_type === 'TEXT'){
          const readMoreButtonSuper = document.querySelector(
            '[extapp="' + "ext-" + id + '"] .copyable-text .read-more-button'
          );
          if (readMoreButtonSuper) {
            readMoreButtonSuper.addEventListener("click", () => {
              setTimeout(() => {
                getText(id);
              }, 500);
            });
            (readMoreButtonSuper as HTMLElement).click();
          } else {                    
            getText(id);
          }          
        }else if(_type === 'AUDIO'){
          getAudioInfos(id) //getAudio(id)
        }else if(_type === 'SHARED_IMG'){
          getSharedImage(id)
        }        

      }
    } catch (err) {
      console.log("Failed handler checkbox. ", err);
    }
  };

  const getText = async (id:string) => {
    try{
      // console.log("@> starting the process of getting the text :: ", id)
      const msgObj: IMessageObject = {
        id: id,
        title: null,
        message: null,
      };

      const divTitle = document.querySelector('[extapp="' + "ext-" + id + '"] div .copyable-text')
      msgObj.title = (divTitle as HTMLElement).attributes.getNamedItem(
        "data-pre-plain-text"
      )?.value;

      const spanParentText = document.querySelector('[extapp="' + "ext-" + id + '"] .copyable-text div span')
      const elementText = spanParentText?.firstChild as HTMLElement;                      
      msgObj.message = (elementText as HTMLElement)?.innerHTML;
      
      for (let index = 0; index < elementText.children.length; index++) {
        const child = elementText.children[index] as HTMLElement;
        if (child.tagName == "IMG") {
          const altAttribute =
            child.attributes.getNamedItem("alt")?.value;
          msgObj.message = await replaceEmoticon(
            msgObj.message,
            altAttribute
          );
        }
        if (child.tagName == "A") {
          const hrefAttribute =
            child.attributes.getNamedItem("href")?.value;
          msgObj.message = await replaceLinkSource(
            msgObj.message,
            hrefAttribute
          );
        }
        if (child.tagName == "UL") {
          msgObj.message = await extractListItemText(msgObj.message);
        }
      }
      addMessage(msgObj);
    }catch (err) {
      console.log("Failed get text. ", err);
    }
  }
  // const getText_V1 = async (id: string) => {
  //   try {
  //       const msgObj: IMessageObject = {
  //         id: id,
  //         title: null,
  //         message: null,
  //       };
  //       const selectorCopyableText =
  //         '[extapp="' + "ext-" + id + '"] .copyable-text';
  //       const copyableTextNodes =
  //         document.querySelectorAll(selectorCopyableText); 
  //       copyableTextNodes.forEach(async (node) => {
  //         if (node.nodeName == "DIV") {
  //           msgObj.title = node.attributes.getNamedItem(
  //             "data-pre-plain-text"
  //           )?.value;
  //         }
  //         if (node.localName == "span") {
  //           const elementText = node.firstChild as HTMLElement;
  //           msgObj.message = elementText.innerHTML;            
  //           if (elementText.localName == "span") {
  //             for (let index = 0; index < elementText.children.length; index++) {
  //               const child = elementText.children[index] as HTMLElement;
  //               if (child.tagName == "IMG") {
  //                 const altAttribute =
  //                   child.attributes.getNamedItem("alt")?.value;
  //                 msgObj.message = await replaceEmoticon(
  //                   msgObj.message,
  //                   altAttribute
  //                 );
  //               }
  //               if (child.tagName == "A") {
  //                 const hrefAttribute =
  //                   child.attributes.getNamedItem("href")?.value;
  //                 msgObj.message = await replaceLinkSource(
  //                   msgObj.message,
  //                   hrefAttribute
  //                 );
  //               }
  //             }
  //           }
  //         }
  //       });
  //       addMessage(msgObj);
  //   } catch (err) {
  //     console.log("Failed get text. ", err);
  //   }
  // };
  const getAudioInfos = async (id:string) => {
    console.log("@> Get Infos about Audio.")
    const  senderNameHTML = document.querySelector('[extapp="' + "ext-" + id + '"] div div div div span')
    const  senderTimeHTML = document.querySelector('[extapp="' + "ext-" + id + '"] ._ak4s .x1rg5ohu')
    const  senderDurationHTML = document.querySelector('[extapp="' + "ext-" + id + '"] ._ak8w')

    const senderName = ((senderNameHTML as HTMLElement).attributes.getNamedItem("aria-label")?.value || 'Contact').replace(':','');
    const senderTime = (senderTimeHTML as HTMLElement).innerText || '0';
    const senderDuration = (senderDurationHTML as HTMLElement).innerText || '0';

    const mediaObj: IMediaObject = {
      id: id,
      message: `Enviado por ${senderName} às ${senderTime}. Duração: ${senderDuration}`,
      type: MediaType.Audio,
      downloaded: 0
    };
    addMedia(mediaObj)
  }
  const getAudio = async (id:string) => {
    console.log("@> Get Audio..")
    const divForHoverEvent = document.querySelector('[extapp="' + "ext-" + id + '"] div div div')
    const mouseoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
      cancelable: true,
    });
    if(divForHoverEvent){
      
      const handlerSpanClick = () => {
        console.log("@> Get Audio: Event Listener: click")
        setTimeout(() => {
          const menuContext = document.querySelector('div [role="application"] li [aria-label="Baixar"]') as HTMLElement ||
          document.querySelector('div [role="application"] li [aria-label="Download"]') as HTMLElement
          (menuContext as HTMLElement).click();          
          removeEventListenerAfterClick();
          
        }, 300);
      }

      const handleDivHover =  () => {
        console.log("@> Get Audio: Event Listener: hover")
        setTimeout(() => {
          const spanContext = document.querySelector('[extapp="' + "ext-" + id + '"] span [role="button"] span') as HTMLElement          
          (spanContext as HTMLElement).addEventListener("click", handlerSpanClick);
          (spanContext as HTMLElement).click();
        }, 300);
      }
      
      const removeEventListenerAfterClick = () => {        
        (divForHoverEvent as HTMLElement).removeEventListener("mouseover", handleDivHover);
      };
      
      (divForHoverEvent as HTMLElement).addEventListener("mouseover", handleDivHover);
      (divForHoverEvent as Element).dispatchEvent(mouseoverEvent);
    }
  }

  const getSharedImage = async (id:string) => {
    const divForHoverEvent = document.querySelector('[extapp="' + "ext-" + id + '"] div .UzMP7 .cm280p3y')
    const mouseoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
      cancelable: true,
    });
    (divForHoverEvent as Element).dispatchEvent(mouseoverEvent);
  }


  const createContainerCheckBox = (parent: HTMLElement, uniqueID: string) => {
    try {
      const root = document.createElement("div");
      root.id = "crx-root-chkbx";
      parent.appendChild(root);

      parent.style.setProperty("display", "flex", "important");
      parent.style.setProperty("align-items", "center", "important");
      parent.style.setProperty("justify-content", "flex-start", "important");

      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <CheckboxStyle id={uniqueID} checked={false} onChange={checkboxChangeHandler} />
        </React.StrictMode>
      );
    } catch (err) {
      console.log("Failed create checkbox container. ", err);
    }
  };

  const showSelectMessages = async () => {
    try {
      const rowsChats = document.querySelectorAll(
        '#main [role="application"] [role="row"]'
      );
      if (rowsChats && rowsChats.length > 0) {
        // clearOutput();
        setSelectMsgs(true);
        rowsChats.forEach((row) => {
          row.querySelector("#crx-root-chkbx")?.remove(); //remove duplicate items.

          const uniqueID = generateID();
          row.setAttribute("extapp", "ext-" + uniqueID);

          createContainerCheckBox(row as HTMLElement, uniqueID);
        });
      }
      {
        setErrorMsg("Entre em uma conversa para selecionar as mensagens.");
      }
    } catch (err) {
      console.log("Failed show checkbox. ", err);
    }
  };

  const removeAllCheckBox = () => {
    try {
      const rowsChats = document.querySelectorAll(
        '#main [role="application"] [role="row"]'
      );
      if (rowsChats) {        
          rowsChats.forEach((row) => {
            row.querySelector("#crx-root-chkbx")?.remove();
          });
      }      
    } catch (err) {
      console.log("Failed remove all checkboxes. ", err);
    }
  };

  const unselectCheckboxes = async (listToRemove?: any[]): Promise<void> => {
    try {
      console.log('@> Unselect Specifics > ', listToRemove);      
      if (listToRemove && listToRemove.length > 0) {
        setIsSelectAllMsgs(false)        
        for (const item of listToRemove) {
          const checkbox = document.getElementById(item.id) as HTMLInputElement;    
          console.log(`@> Unselect Checkbox ${item.id} > `, checkbox);          
          if (checkbox) {
              // checkbox.checked = false;
              // uncheckedHandler(item.id)    
              checkboxChangeHandler(item.id, false)             
          }
        } 
      } 
    } catch (err) {
      console.log("Failed to unselect checkboxes. ", err);
      throw err;
    }
  }

  const selectAllMessages = () => {
    try {
      if(isSelectAllMsgs){
          return;
      }
      
      const checkboxes = document.querySelectorAll(
        '#main [data-extapp="chckbx"]'
      );
      if (checkboxes) {
        checkboxes.forEach((box) => {
          (box as HTMLElement).click();
        });
        setIsSelectAllMsgs(true)
      }
    } catch (err) {
      console.log("Failed select all messages. ", err);
    }
  };


  const cancelAction = async () => {
    console.log('@> call CANCEL ACTION ')
    setSelectMsgs(false);
    setIsSelectAllMsgs(false);
    removeAllCheckBox();
    setMessages([]);
    setMediaList([]);
    await chrome.storage.local.set({ "AppExt-Files": [] })
    await chrome.storage.local.set({ "clipboard-AppExt": 'reset' })
  }
  
  // const needAGeneralReset = (messagesStore:any, mediaFilesStore:any) => {
  const needAGeneralReset = async () => {
    console.log('@> needAGeneralReset')
    const resultClipboard = await chrome.storage.local.get("clipboard-AppExt");
    const resultFiles = await chrome.storage.local.get("AppExt-Files");    
    const haveMessages = resultClipboard["clipboard-AppExt"] && Array.isArray(resultClipboard["clipboard-AppExt"]) && resultClipboard["clipboard-AppExt"].length>0; 
    const haveFiles = resultFiles["AppExt-Files"] && Array.isArray(resultFiles["AppExt-Files"]) && resultFiles["AppExt-Files"].length>0; 
    
    // const haveMessages = messagesStore && Array.isArray(messagesStore) && messagesStore.length>0 ? true : false
    // const haveFiles = mediaFilesStore && Array.isArray(mediaFilesStore) && mediaFilesStore.length>0 ? true : false
    // const haveMessages = messagesStore && Array.isArray(messagesStore) && messagesStore.length > 0;
    // const haveFiles = mediaFilesStore && Array.isArray(mediaFilesStore) && mediaFilesStore.length > 0;

    console.log(`@> needAGeneralReset - haveFiles:${haveFiles} && haveMessages:${haveMessages}`);

    if(haveFiles === false && haveMessages=== false){
      return true
    }else{
      return false
    }    
  }

  const clearDataMessages = async (listIDs: any[] | undefined) => {    
      console.log('@> clearDataMessages - listIDs:', listIDs)          
      unselectCheckboxes(listIDs)
      setMessages([]);
      // setCopiedText(null)
      // clearOutput();
      await chrome.storage.local.set({ "clipboard-AppExt": 'reset' })    
  };
  const clearDataFiles = async (listIDs: any[] | undefined) => {              
      console.log('@> clearDataFiles - listIDs:', listIDs)
      unselectCheckboxes(listIDs)  
      setMediaList([]);
      await chrome.storage.local.set({ "AppExt-Files": [] })    
  };
  // const clearOutput = () => {
  //   const output = document.querySelector("#output")
  //     ? document.querySelector("#output")
  //     : null;
  //   if (output) output.innerHTML = "";
  // };

  return (
    <>
      <Container>
        {selectMsgs ? (          
          <div className="flex flex-col gap-y-4">            
            {!isSelectAllMsgs && (
              <Button id="selectAll" onClick={selectAllMessages}>
                Selecionar mensagens recentes
              </Button>
            )}
            {/* {messages && messages.length > 0 && (
              <Button id="copyButton" typeButton="secondary" onClick={copyAction}>
                Copiar as mensagens
              </Button>
            )} */}
          </div>
        ) : (
          <Button id="selectMsgBtn" onClick={showSelectMessages}>
            Selecionar mensagens
          </Button>
        )}

        {/* <div className="overflow-y-none max-h-72"> */}
        {messages && messages.length>0 && (         
          <>
            <ShowText data={sortMessages(messages)}></ShowText>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-500"></div>
              <div className="flex-grow border-t border-gray-500"></div>
            </div>
          </>            
        )}
        {mediaList && mediaList.length>0 && (            
          <ShowMediaList data={mediaList} handlerData={getAudio} />
        )}
        {/* </div> */}

        {((messages && messages.length>0) || (mediaList && mediaList.length>0)) && (            
            <Button id="cancel" typeButton="danger" onClick={cancelAction}>
              Apagar mensagens
            </Button>
            
        )}
        {errorMsg && (
          <span className="text-sm text-pretty text-red-500 tracking-wide">
            {errorMsg}
          </span>
        )}        
      </Container>
    </>
  );
}

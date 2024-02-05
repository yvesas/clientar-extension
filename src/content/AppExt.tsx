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

export function AppExt(): React.ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectMsgs, setSelectMsgs] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessageObject[]>([]);

  useEffect(() => {
    if (selectMsgs) {
      setErrorMsg(null);
    }
  }, [selectMsgs, isFirstRender]);

  const addEventClearAll = () => {
    try {
      if (isFirstRender) {
        const menuWpElements = document.querySelectorAll(
          "#app ._3RGKj .g0rxnol2"
        );
        if (menuWpElements && menuWpElements.length > 0) {
          menuWpElements.forEach((ele) => {
            ele.addEventListener("click", () => {
              clearDataAction();
            });
          });
          setIsFirstRender(false);
        }
        // chrome.runtime.onMessage.addListener(function(message, sender) {
        //   console.log('>>> CONTENT WPP recebeu! >>> sender:', sender)
        //   if (message.action === "sendTextEXT") {

        //     const data = message.message
        //     console.log('>>> CONTENT WPP recebeu! --> ', data)

        //   }
        // });
      }
    } catch (err) {
      console.error("Failed add event Clear. ", err);
    }
  };
  addEventClearAll();

  const addMessage = (messageObject: IMessageObject) => {
    if (messageObject.id && messageObject.title && messageObject.message) {
      setMessages((old) => [...old, messageObject]);
    }
  };
  const removeMessage = (id: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
  };

  const replaceEmoticon = async (
    text: string | null,
    altValue: string | undefined
  ): Promise<string | null> => {
    if (!altValue) {
      return text;
    }
    if (!text) {
      return text;
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
          }
        );
        resolve(newText);
      } catch (error) {
        reject(error);
      }
    });
  };

  const replaceLinkSource = async (
    text: string | null,
    hrefValue: string | undefined
  ): Promise<string | null> => {
    if (!hrefValue) {
      return text;
    }
    if (!text) {
      return text;
    }
    return new Promise((resolve, reject) => {
      try {
        const newText = text.replace(
          /<a[^>]*?\s*href="(.+?)"[^>]*?>\s*\n?\s*(?:.*?)<\/a>/i,
          (match, href) => {
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
    try {
      if (messages && messages.length > 0) {
        const messagesOrdered = await sortMessages(messages);
        let fullText = "";
        messagesOrdered.forEach((item: any, index: any) => {
          if (index > 0) {
            fullText += item.title + " " + item.message + "\n";
          } else {
            fullText = item.title + " " + item.message + "\n";
          }
        });
        navigator.clipboard.writeText(fullText);
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          setCopiedText(clipText);
          clearDataAction();
          // console.log('>> GO Send Message >>')
          // chrome.runtime.sendMessage({
          //   action: "sendTextEXT",
          //   message: clipText
          // })
        }
      }
    } catch (err) {
      console.error("Failed copy action. ", err);
    }
  };

  const getText = async (id: string, checked: boolean) => {
    try {
      if (!checked) {
        removeMessage(id);
      } else {
        const msgObj: IMessageObject = {
          id: id,
          title: null,
          message: null,
        };
        const selectorCopyableText =
          '[extapp="' + "ext-" + id + '"] .copyable-text';
        const copyableTextNodes =
          document.querySelectorAll(selectorCopyableText);

        copyableTextNodes.forEach(async (node) => {
          if (node.nodeName == "DIV") {
            msgObj.title = node.attributes.getNamedItem(
              "data-pre-plain-text"
            )?.value;
          }
          if (node.localName == "span") {
            const elementText = node.firstChild as HTMLElement;
            msgObj.message = elementText.innerHTML;

            if (elementText.localName == "span") {
              for (
                let index = 0;
                index < elementText.children.length;
                index++
              ) {
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
              }
            }
          }
        });
        addMessage(msgObj);
      }
    } catch (err) {
      console.error("Failed get text. ", err);
    }
  };

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
          <CheckboxStyle id={uniqueID} checked={false} onChange={getText} />
        </React.StrictMode>
      );
    } catch (err) {
      console.error("Failed create checkbox container. ", err);
    }
  };

  const showSelectMessages = async () => {
    try {
      const rowsChats = document.querySelectorAll(
        '#main [role="application"] [role="row"]'
      );
      if (rowsChats && rowsChats.length > 0) {
        clearOutput();
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
      console.error("Failed show checkbox. ", err);
    }
  };

  const removeSelectMessages = () => {
    try {
      const rowsChats = document.querySelectorAll(
        '#main [role="application"] [role="row"]'
      );
      if (rowsChats) {
        setSelectMsgs(false);
        rowsChats.forEach((row) => {
          row.querySelector("#crx-root-chkbx")?.remove();
        });
      }
    } catch (err) {
      console.error("Failed remove checkbox. ", err);
    }
  };

  const selectAllMessages = () => {
    try {
      const checkboxes = document.querySelectorAll(
        '#main [data-extapp="chckbx"]'
      );
      if (checkboxes) {
        checkboxes.forEach((box) => {
          (box as HTMLElement).click();
        });
      }
    } catch (err) {
      console.error("Failed select all messages. ", err);
    }
  };

  const clearDataAction = () => {
    setMessages([]);
    removeSelectMessages();
    clearOutput();
  };

  const clearOutput = () => {
    const output = document.querySelector("#output")
      ? document.querySelector("#output")
      : null;
    if (output) output.innerHTML = "";
  };

  return (
    <>
      <Container>
        {selectMsgs ? (
          <div className="flex flex-col gap-y-4">
            <Button id="selectAll" onClick={selectAllMessages}>
              Selecionar mensagens recentes
            </Button>

            {messages && messages.length > 0 && (
              <Button id="copyButton" onClick={copyAction}>
                Copiar as mensagens
              </Button>
            )}
          </div>
        ) : (
          <Button id="selectMsgBtn" onClick={showSelectMessages}>
            Selecionar mensagens
          </Button>
        )}
        {errorMsg && (
          <span className="text-sm text-pretty text-red-500 tracking-wide">
            {errorMsg}
          </span>
        )}

        <ShowText id="output">{copiedText}</ShowText>
        <Button id="cancel" typeButton="danger" onClick={clearDataAction}>
          Apagar mensagens
        </Button>
      </Container>
    </>
  );
}

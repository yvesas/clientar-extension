import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { AppExt } from "./AppExt";
import { AppExtCRM } from "./AppExtCRM";

function insertPage() {
  try {
    if (window.location.hostname.includes("whatsapp")) {
      setTimeout(function () {
      const appComponent = document.querySelector("#app") as HTMLElement;
      if (appComponent) {
        appComponent.style.setProperty("max-width", "100%", "important");
        appComponent.style.setProperty(
          "width",
          "calc(100% - 300px)",
          "important"
        );

        const root = document.createElement("div");
        root.id = "crx-root";
        appComponent.appendChild(root);
        console.log('CREATE Ext WPP! <><><>>>')
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <AppExt />
          </React.StrictMode>
        );
      }
      }, 1500);
    }

    if (window.location.hostname.includes("clientarcrm")) {
      // const crmComponentOld_specific = document.querySelectorAll("body.main textarea"); // get old CRM
      // const crmComponentNew_specific = document.querySelectorAll("div.editor__button button span"); // get new CRM

      const crmComponentNew = document.querySelector(
        "#main-wrapper"
      ) as HTMLElement;
      const crmComponentOld = document.querySelector(
        "body.main"
      ) as HTMLElement;
      // console.log('>> ACHOU clientar crm OLD --> ', crmComponentOld)

      if (crmComponentOld) {
        const root = document.createElement("div");
        root.id = "crx-root";
        crmComponentOld.appendChild(root);

        setTimeout(function () {
          ReactDOM.createRoot(root).render(
            <React.StrictMode>
              <AppExtCRM />
            </React.StrictMode>
          );
        }, 1500);
      } else if (crmComponentNew) {
        const root = document.createElement("div");
        root.id = "crx-root";
        crmComponentNew.appendChild(root);
        // crmComponentNew.style.setProperty("max-width", "100%", 'important')
        // crmComponentNew.style.setProperty("width", "calc(100% - 320px)", 'important')
        setTimeout(function () {
          ReactDOM.createRoot(root).render(
            <React.StrictMode>
              <AppExtCRM />
            </React.StrictMode>
          );
        }, 1500);
      }
    }
  } catch (err) {
    console.error("Failed insert page. ", err);
  }

}

insertPage();

// (async () => {
//   const response = await chrome.runtime.sendMessage({action: "hello"});
//   console.log('Ata: ', response);
// })();s
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log('> CONTENT GERAL recebeu! - request:', request, sender)
//     if (request.action==="hello"){
//       sendResponse({farewell: "goodbye"});
//     }
//     if (request.action==="sendTextEXT"){
//       sendResponse({response: ">>> CONTENT GERAL recebeu 1"});
//     }
//     if (request.action==="sendTextEXTForAll"){
//       sendResponse({response: "> CONTENT GERAL -> "+request.message});
//     }
//   }
// );
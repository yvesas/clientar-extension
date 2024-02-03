import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { AppExt } from "./AppExt";
import { AppExtCRM } from "./AppExtCRM";


function insertPage() {
  if(window.location.hostname.includes("whatsapp")){
    const appComponent = document.querySelector("#app") as HTMLElement; 
    if (appComponent) { 
      appComponent.style.setProperty("max-width", "100%", 'important') 
      appComponent.style.setProperty("width", "calc(100% - 320px)", 'important')
      
      const root = document.createElement("div");
      root.id = "crx-root";
      appComponent.appendChild(root);

      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <AppExt />        
        </React.StrictMode>
      );    
    }
  }


  if(window.location.hostname.includes("clientarcrm")){
    // const crmComponentOld_specific = document.querySelectorAll("body.main textarea"); // get old CRM
    // const crmComponentNew_specific = document.querySelectorAll("div.editor__button button span"); // get new CRM
    
    const crmComponentNew = document.querySelector("#main-wrapper") as HTMLElement; 
    const crmComponentOld = document.querySelector("body.main") as HTMLElement; 
    // console.log('>> ACHOU clientar crm OLD --> ', crmComponentOld)
    
    if (crmComponentOld) {
      const root = document.createElement("div");
      root.id = "crx-root";    
      crmComponentOld.appendChild(root);

      setTimeout(function() {
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <AppExtCRM/> 
          </React.StrictMode>
        ); 
      }, 2500);   

    }else if(crmComponentNew){
      const root = document.createElement("div");
      root.id = "crx-root";    
      crmComponentNew.appendChild(root);
      // crmComponentNew.style.setProperty("max-width", "100%", 'important') 
      // crmComponentNew.style.setProperty("width", "calc(100% - 320px)", 'important')
      setTimeout(function() {
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <AppExtCRM/> 
          </React.StrictMode>
        ); 
      }, 2500);
     
    }

  }//

}

insertPage();


// async function setupPage() {
  // chrome.tabs.onActivated.addListener((activeInfo) => {
  //   console.log('<>> TAB ACTIVATED -> ', activeInfo)
  // });
  
//   const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
//   console.log('TABs chrome', tab);
//   if(tab){
//     const tabID = tab.id ? tab.id : 0
//     const response = await chrome.tabs.sendMessage(tabID, {greeting: "hello"});
//     // do something with response here, not outside the function
//     console.log('Send MSG tab content >>>', response);
//   }

//   chrome.runtime.onMessage.addListener(function(message, sender) {
//     console.log('>>> CONTENT recebeu! >>> sender:', sender)
//     if (message.action === "sendTextEXT") {
      
//       const data = message.message
//       console.log('>>> CONTENT recebeu! --> ', data)
      
//     }
//   });
  
// }
// setupPage()

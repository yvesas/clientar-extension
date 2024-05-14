import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { AppExt } from "./AppExt";
import { AppExtCRM } from "./AppExtCRM";


function insertAppExt() {
  try {
    console.log("Hello! - App Ext");
    if(document.querySelector("#crx-root")){
      console.log("@> exist App Ext")
      return
    }
    if (window.location.hostname.includes("whatsapp")) {
      console.log("On Wpp! - inserting App Ext");       
      setTimeout(() => {            
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
          ReactDOM.createRoot(root).render(
            <React.StrictMode>
              <AppExt />
            </React.StrictMode>
          );
        } 
      }, 500);     
    }

    if (window.location.hostname.includes("clientarcrm")) {
      console.log("On Clientar! - inserting App Ext");
      const crmComponentNew = document.querySelector(
        "#main-wrapper"
      ) as HTMLElement;
      const crmComponentOld = document.querySelector(
        "body.main"
      ) as HTMLElement;      

      if (crmComponentOld) {
        const root = document.createElement("div");
        root.id = "crx-root";
        crmComponentOld.appendChild(root);        
          ReactDOM.createRoot(root).render(
            <React.StrictMode>
              <AppExtCRM newVersion={false} />
            </React.StrictMode>
          );

      } else if (crmComponentNew) {
        const root = document.createElement("div");
        root.id = "crx-root";
        crmComponentNew.appendChild(root);        
          ReactDOM.createRoot(root).render(
            <React.StrictMode>
              <AppExtCRM newVersion={true}/>
            </React.StrictMode>
          );        
      }
    }
  } catch (err) {
    console.log("Failed insert App Ext. ", err);
  }
}

// function removeAppExt() {
//   try {
//     if (window.location.hostname.includes("whatsapp")) {      
//       const appComponent = document.querySelector("#app") as HTMLElement;      

//       if (appComponent) {
//         document.querySelector("#crx-root")?.remove();
//         appComponent.style.removeProperty("max-width");
//         appComponent.style.removeProperty("width");

//         const rowsChats = document.querySelectorAll(
//           '#main [role="application"] [role="row"]'
//         );
//         if (rowsChats) {
//           rowsChats.forEach((row) => {
//             row.querySelector("#crx-root-chkbx")?.remove();
//           });
//         }
//       }
//     }

//     if (window.location.hostname.includes("clientarcrm")) {    
//       const crmComponentNew = document.querySelector(
//         "#main-wrapper"
//       ) as HTMLElement;
//       const crmComponentOld = document.querySelector(
//         "body.main"
//       ) as HTMLElement;      

//       if (crmComponentOld) {     
//         document.querySelector("#crx-root")?.remove();

//         const hookElements = document.querySelectorAll("#crx-root-container");
//         hookElements.forEach((ele) => {
//           const parentNode = ele.parentElement ? ele.parentElement : null 
//           const textarea = ele.querySelector("textarea") ? ele.querySelector("textarea") : null          
//           if(ele && parentNode && textarea){           
//             parentNode.insertBefore(textarea, ele);
//             ele?.remove();
//           }
//         }) 

//       } else if (crmComponentNew) {           
//         document.querySelector("#crx-root")?.remove();        
//       }

//       const elements = document.querySelectorAll("#crx-root-btn");
//       if (elements) {
//         elements.forEach((ele) => {
//           ele?.remove();
//         });
//       }
//     }

//     chrome.storage.local.set({ "clipboard-AppExt": null })

//   } catch (err) {
//     console.error("Failed remove App Ext. ", err);
//   }
// }

// async function startup() {
//   const result = await chrome.storage.local.get("AppExtOpen")
//   const openExt = result ? result.AppExtOpen : null
//   if(openExt == null || openExt == true){
//     // console.info('>> Running startUp - Open value:', openExt)
//       insertAppExt();
//   }
//   chrome.storage.onChanged.addListener(
//     function(changes) {
//       if(changes && changes["AppExtOpen"]){        
//         // console.info('>> Running onChange - Open - new value:', changes["AppExtOpen"].newValue)
//         const openExt = changes["AppExtOpen"] ? changes["AppExtOpen"].newValue : false        
//         if(openExt){          
//           insertAppExt();
//         }else{
//           removeAppExt()
//         }
//       }
//     }
//   );
// }
// startup();
insertAppExt();



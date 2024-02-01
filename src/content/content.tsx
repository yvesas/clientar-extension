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

      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <AppExtCRM version="OLD"/>
        </React.StrictMode>
      );    

    }else if(crmComponentNew){
      const root = document.createElement("div");
      root.id = "crx-root";    
      crmComponentNew.appendChild(root);

      crmComponentNew.style.setProperty("max-width", "100%", 'important') 
      crmComponentNew.style.setProperty("width", "calc(100% - 320px)", 'important')

      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <AppExtCRM version="NEW"/> 
        </React.StrictMode>
      ); 
    }

  }  
}

insertPage();
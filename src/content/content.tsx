import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { AppExt } from "./AppExt";


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
    // const crmComponent = document.querySelectorAll("body.main textarea"); 
    const crmComponent = document.querySelector("body.main"); 
    console.log('>> ACHOU clientarcrm > main -> ', crmComponent)
    if (crmComponent) {
      const root = document.createElement("div");
      root.id = "crx-root";    
      crmComponent.appendChild(root);

      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <div>BTN COLAR</div>
        </React.StrictMode>
      );    
    }

  }
  
  console.log('>>>> CONTENT SCRIPT runs ---')
}

insertPage();
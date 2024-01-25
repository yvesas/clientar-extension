import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppExt } from "./AppExt";
// import { AppExtension } from "./AppExtension";


function insertPage() {
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
        {/* <AppExtension parentElement={appComponent} /> */}
      </React.StrictMode>
    );
    
  }
}

insertPage();

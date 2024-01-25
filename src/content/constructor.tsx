import { AppExtension } from "./AppExtension";
import { render } from "./render";

function insertPage() {
  const appComponent = document.querySelector("#app") as HTMLElement; 
  if (appComponent) { 
    appComponent.style.setProperty("max-width", "100%", 'important') 
    appComponent.style.setProperty("width", "calc(100% - 320px)", 'important')
    
    render(<AppExtension parentElement={appComponent} />);
  }
}
insertPage();

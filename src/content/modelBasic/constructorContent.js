
function createExtensionApp(){
    let extensionApp = document.createElement('div');
    extensionApp.style.setProperty("z-index", "100", 'important')
    extensionApp.style.setProperty("position", "fixed", 'important')
    extensionApp.style.setProperty("top", "0", 'important')
    extensionApp.style.setProperty("right", "0", 'important')
    extensionApp.style.setProperty("width", "320px", 'important')
    extensionApp.style.setProperty("height", "100%", 'important')
    extensionApp.style.setProperty("background-color", "gray", 'important')
    extensionApp.style.setProperty("padding", "5px", 'important')
    extensionApp.style.setProperty("display", "flex", 'important');
    extensionApp.style.setProperty("flex-direction", "column", 'important');
    extensionApp.style.setProperty("gap", "2px", 'important');
    return extensionApp
}

function createOutput(){
  let output = document.createElement('textarea');
  output.id = "output";
  return output
}

function createButtonCopy(){
  let btnCopy = document.createElement('button');
  btnCopy.id = "copyButton";
  btnCopy.innerHTML = "Copiar mensagens";
  btnCopy.style.setProperty("padding", "5px", 'important')
  btnCopy.style.setProperty("padding", "5px", 'important')
  // btnCopy.style.setProperty("width", "0px", 'important')
  btnCopy.style.setProperty("background-color", "white", 'important')

  btnCopy.addEventListener('click', function () {
    
    
    let copyText = document.querySelector('._11JPr.selectable-text.copyable-text')
    if(copyText && copyText.textContent){
      navigator.clipboard.writeText("COPY: "+copyText.textContent);
      navigator.clipboard.readText().then((clipText) => {
        
        
        let ele = document.getElementById("output")
        
        
        ele.innerHTML = clipText;
      });
      
    }  
  
    
  })

  return btnCopy
}

function insertPage() {
  let appComponent = document.querySelector("#app"); 
  if (appComponent) { 
    appComponent.style.setProperty("max-width", "100%", 'important') 
    appComponent.style.setProperty("width", "calc(100% - 320px)", 'important')
    
    let extensionApp =  createExtensionApp();
    
    let output = createOutput();
    extensionApp.appendChild(output);
    let btnCopy = createButtonCopy();
    extensionApp.appendChild(btnCopy);

    appComponent.insertAdjacentElement('afterend', extensionApp);
  }
}

insertPage();
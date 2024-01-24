
// console.log("VAI VER O QUE TEM! window ->", window);
// window.addEventListener("load", function() {
//   console.log("A página foi carregada! [load]");
//   insertPage()
// });
// window.document.addEventListener("DOMContentLoaded", function() {
//   console.log("O DOM foi carregado! [DOMContentLoaded]");
//   insertPage()
// });

function createExtensionApp(){
    let extensionApp = document.createElement('div');
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
    console.log('CLICK copy button!')
    
    let copyText = document.querySelector('._11JPr.selectable-text.copyable-text')
    if(copyText && copyText.textContent){
      navigator.clipboard.writeText("COPY: "+copyText.textContent);
      navigator.clipboard.readText().then((clipText) => {
        console.log('READ text -> ', clipText)
        
        let ele = document.getElementById("output")
        console.log('READ text o ELEmento -> ', ele)
        
        ele.innerHTML = clipText;
      });
      console.log('COPY ->>', copyText.textContent)
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
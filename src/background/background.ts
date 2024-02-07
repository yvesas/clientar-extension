/* eslint-disable @typescript-eslint/no-explicit-any */

let toggle = false
chrome.action.onClicked.addListener(() => {
  toggle=!toggle
  // console.log('toggle: ', toggle)
  if(toggle){
    // open or close extension!
  }  
});

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.action==="hello"){
//       sendResponse({farewell: "goodbye"});
//     }
//     if (request.action==="sendTextEXT"){
//       console.log(sender.tab ?
//         "00 from a content script:" + sender.tab.url :
//         "00 from the extension");
        
//       chrome.runtime.sendMessage({
//         action: "sendTextEXTForAll",
//         message: request.message
//       })

//       sendResponse({response: "BKC: "+request.message});
//     }
//   }
// );

// function getCurrentTab(callback:any) {
//   const queryOptions = { active: true, lastFocusedWindow: true };
//   chrome.tabs.query(queryOptions, ([tab]) => {
//     if (chrome.runtime.lastError)
//     console.error(chrome.runtime.lastError);
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     callback(tab);
//   });
// }
// getCurrentTab((tab:any)=>{
//   console.log('A TAB > ', tab)
// })

// chrome.storage.onChanged.addListener(
//   function(changes) {
//     console.log("CHANGES on Background: ", changes);  
//   }
// );

let toggle = true

function setOpenExtension () {
  toggle=!toggle
  chrome.storage.local.set({"AppExtOpen": toggle })
  return toggle
}

chrome.action.onClicked.addListener(() => {
  setOpenExtension() 
});

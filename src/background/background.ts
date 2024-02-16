
let toggle = true

function setOpenExtension () {
  toggle=!toggle
  console.log('<set> toggle value: ', toggle)
  chrome.storage.local.set({"AppExtOpen": toggle })
  return toggle
}

chrome.action.onClicked.addListener(() => {
  setOpenExtension() 
});

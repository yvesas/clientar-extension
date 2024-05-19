/* eslint-disable @typescript-eslint/no-explicit-any */
let toggle = true;

function setOpenExtension() {
  toggle = !toggle;
  chrome.storage.local.set({ AppExtOpen: toggle });
  console.log('@> AppExtOpen:', toggle)
  return toggle;
}
chrome.action.onClicked.addListener(() => {
  setOpenExtension();
});

async function addNewDownload(objDownload: any) {
  const { id, filename, endTime='', state={} } = objDownload;

  try {
    const result = await chrome.storage.local.get("AppExt-Downloads");
    const downloadList = result["AppExt-Downloads"] || [];
    const existingDownloadIndex = downloadList.findIndex((item: any) => item.id === id);

    if (existingDownloadIndex !== -1) {
      if(state && state.current == "complete"){
        downloadList[existingDownloadIndex] = {
          ...downloadList[existingDownloadIndex],          
          ...(filename ? { filename } : ''),
          ...(endTime ? { endTime } : ''),
          ...(state ?  { state } : {}),
        };
      }      
    } else {
      if(id && filename){
        downloadList.push({ id, filename, endTime, state });
      }      
    }
    
    await chrome.storage.local.set({ "AppExt-Downloads": downloadList });

    console.log(`Download ${id ? `(ID: ${id})` : ''} added or updated successfully. List: `, downloadList);
  } catch (error) {
    console.error("Error adding or updating download:", error);
  }
}

// console.log("@> chrome objetct: ", chrome);
chrome.downloads?.onChanged.addListener(function (delta) {
  console.log("@> chrome.downloads.onChange : ", delta);
  addNewDownload(delta)
});

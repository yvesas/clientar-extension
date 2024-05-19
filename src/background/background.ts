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
    console.log("@> addNewDownload : ", objDownload);
    
    const result = await chrome.storage.local.get("AppExt-Files");
    const downloadList = result["AppExt-Files"] && Array.isArray(result["AppExt-Files"]) ? result["AppExt-Files"] : [];
    // if(downloadList && !Array.isArray(downloadList)){  
    //   downloadList = []
    // }            

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

    await chrome.storage.local.set({ "AppExt-Files": downloadList });

    console.log(`Download ${id ? `(ID: ${id})` : ''} added or updated successfully. List: `, downloadList);
    // chrome.downloads.show(id)

  } catch (error) {
    console.error("Error adding or updating file:", error);
  }
}

// console.log("@> chrome objetct: ", chrome);
chrome.downloads?.onChanged.addListener(function (delta) {
  console.log("@> chrome.downloads.onChange : ", delta);
  addNewDownload(delta)
});

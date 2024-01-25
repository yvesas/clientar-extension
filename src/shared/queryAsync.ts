/* eslint-disable @typescript-eslint/no-unused-vars */
export async function queryAsync(selector: string, parentID?: string): Promise<Element | null | undefined> {
  return new Promise((resolve) => {
    let element = null
    if(parentID){
      element = document.getElementById(parentID)?.querySelector(selector);
    }else{
      element = document.querySelector(selector);
    }
    
    resolve(element);
  });
}
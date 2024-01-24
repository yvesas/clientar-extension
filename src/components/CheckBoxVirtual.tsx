import React from "react";
import { ShadowDom } from "./ShadowDom";

export function CheckBoxVirtual(): React.ReactElement | null {
  const [parentElement] = React.useState(() =>
    // document.querySelector("._5kRIK") // background chat
    document.querySelector("div[role='row']")
  );

  return parentElement ? (
    <ShadowDom parentElement={parentElement}>hey!
      {/* <input type="checkbox" 
      className="lhggkp7q cxec7x23 kanlod6e gfz4du6o r7fjleex nmeg1xfo okm7a8wg le5p0ye3">        
      </input> */}
      {/* <div style={{ backgroundColor: "red", width:"50px" }}>       
      </div> */}
    </ShadowDom>
  ) : null;
}

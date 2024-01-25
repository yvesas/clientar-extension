import React, {useState} from "react";
import { Body } from "../components/Body";
import { Button } from "../components/Button";
import { ShowText } from "../components/ShowText";

export function AppExt(): React.ReactElement {
  const [copiedText, setCopiedText] = useState("")

  
  const copyAction = () => {
      const copyText = document.querySelector('._11JPr.selectable-text.copyable-text')
      if(copyText && copyText.textContent){
        navigator.clipboard.writeText(copyText.textContent);
        navigator.clipboard.readText().then((clipText) => {
          console.log('READ text -> ', clipText)
          
          // const ele = document.getElementById("output") as HTMLElement
          // console.log('READ text o Elemento -> ', ele)
          // ele.innerHTML = clipText;

          setCopiedText(clipText)
        });
        console.log('COPY ->>', copyText.textContent)
      }       
  }

  return (
    <>
      <Body>
        <ShowText id="output" >{copiedText}</ShowText>
        <Button id="copyButton" onClick={copyAction} >Copiar as mensagens</Button>
      </Body>
    </>
  )
}
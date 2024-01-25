import React, {useState} from "react";
import { ShadowDom } from "./ShadowDom";
import { Body } from "./Body";
import { Button } from "./Button";
import { ShowText } from "./ShowText";

interface AppExtensionProps {
  parentElement: HTMLElement
}

export function AppExtension(props:AppExtensionProps): React.ReactElement | null {
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

  return props.parentElement ? (
    <ShadowDom parentElement={props.parentElement} position="afterend" >
      <Body>
        <ShowText id="output" >{copiedText}</ShowText>
        <Button id="copyButton" onClick={copyAction} >Copiar as mensagens</Button>
      </Body>
    </ShadowDom>
  ) : null;
}
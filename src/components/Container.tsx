import {ReactNode} from "react";
// import imgLogo from "../assets/logo.png"
interface ComponentProps {
  children: ReactNode
}
export function Container({ children }: ComponentProps) {

  const imgLogo = chrome.runtime.getURL("logo_branco.png")

  return (
    <div className="fixed top-0 right-0 w-[320px] h-screen bg-white flex flex-col gap-y-10 z-500 px-2 py-2"  >
      <div className="flex flex-row gap-x-2 w-ful pt-5 ">
        {/* <img className="w-full h-20 border border-slate-200 rounded-md" src="https://s3.amazonaws.com/clientarftp/test/logo_20211123094921.png" /> */}
        <img className="w-full" src={imgLogo} />
      </div>            
      <div className="flex flex-col gap-y-8">
        {children}
      </div>      
    </div>
  )
}
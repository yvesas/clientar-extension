import {ReactNode} from "react";
// import imgLogo from "../assets/logo.png"
interface ComponentProps {
  children: ReactNode
}
export function Container({ children }: ComponentProps) {

  const imgLogo = chrome.runtime.getURL("logo_branco.png")

  return (
    <div className="fixed top-0 right-0 w-[300px] h-screen bg-white flex flex-col z-500 px-3 gap-2"  >
      <div className="flex flex-row gap-x-2 w-ful pt-4">
        {/* <img className="w-full h-20 border border-slate-200 rounded-md" src="https://s3.amazonaws.com/clientarftp/test/logo_20211123094921.png" /> */}
        <img className="w-full" src={imgLogo} />
      </div>       
      <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          {/* <span className="flex-shrink mx-4 text-gray-700">Content</span> */}
          <div className="flex-grow border-t border-gray-400"></div>
      </div>           
      <div className="flex flex-col gap-y-8">
        {children}
      </div>      
    </div>
  )
}
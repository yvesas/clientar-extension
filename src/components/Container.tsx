import {ReactNode} from "react";
interface ComponentProps {
  children: ReactNode
}
export function Container({ children }: ComponentProps) {
  return (
    <div className="fixed top-0 right-0 w-[320px] h-screen bg-[#EFF2F5] px-4 py-2 flex flex-col gap-y-6 z-500"  >
      <div className="flex flex-row gap-x-2">
        <img className="w-full h-20 border border-slate-200 rounded-md" src="https://s3.amazonaws.com/clientarftp/test/logo_20211123094921.png" />
      </div>
      <div className="flex flex-col gap-y-8">
        {children}
      </div>      
    </div>
  )
}
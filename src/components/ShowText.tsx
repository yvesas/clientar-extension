import { ReactNode } from 'react'

export interface ShowTextProps {
  id: string
  children: ReactNode
}

export function ShowText({ id, children }: ShowTextProps) {
  return (
    <div className='flex flex-col gap-y-2'>
    <span className='text-gray-800'>Mensagens copiadas:</span>
    <div id={id} className='w-[full] min-h-20 overflow-auto max-h-28 p-2 border border-slate-400 rounded-md text-sm text-pretty text-slate-700 tracking-normal'>
      {children}
    </div>
    </div>
  )
}

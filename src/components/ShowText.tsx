import { IMessageObject } from '../shared/IMessageObject'

export interface ShowTextProps {  
  data: IMessageObject[]
}

export function ShowText({ data }: ShowTextProps) {
  return (
    <div className='flex flex-col gap-y-2'>
    <span className='text-gray-800'>Mensagens copiadas:</span>
      <div className='overflow-auto max-h-64 flex flex-col gap-1'>
        {data.map((msg, index) => (
            <div key={`${msg.id}-${index}`} className='py-2 px-2 border border-slate-400 rounded-md text-sm text-pretty text-slate-700 tracking-normal bg-slate-100'>            
              <p>{`${msg.title} ${msg.message}`}</p>               
            </div>
          ))}
      </div>
    </div>
  )
}

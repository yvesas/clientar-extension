/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMediaObject } from "../shared/IMediaObject"
import { MediaType } from "../shared/MediaType"

export interface Props {
  data: IMediaObject[]
  handlerData: (id:string) => void;
}
interface TypeCompProps{
  media: IMediaObject
}

function TypeComp({media}: TypeCompProps){
  let typeDescription = 'Arquivo'
  switch (media.type) {
    case MediaType.Audio:
      typeDescription = 'Audio'
      break;
    case MediaType.Image:
      typeDescription = 'Imagem'
      break;  
    default:
      break;
  }
  return (
    <p className=" text-base underline decoration-1 decoration-slate-400 underline-offset-2 text-slate-950">{typeDescription}</p>
  )
}

// function DownloadedComp({media}: TypeCompProps){  
//   if(media.downloaded){
//     return (
//       <div className="flex flex-row gap-1">
//         <p className="text-base underline decoration-1 decoration-slate-400 underline-offset-2 text-slate-950">Download realizado!</p>

//       </div>
//     )
//   }else{
//     return (<></>)
//   }  
// }

export function ShowMediaList({ data, handlerData }: Props) {
  return (
    <div className='flex flex-col gap-y-2'>
      <span className='text-gray-800'>Mídias para download:</span>
      <div className='overflow-y-scroll max-h-64 flex flex-col gap-1'>
        {data.map((media, index) => (
          <div key={`${media.id}-${index}`} className='py-2 px-2 border border-slate-400 rounded-md text-sm text-pretty text-slate-700 tracking-normal bg-slate-100'>
            <div>
              <TypeComp media={media}/>          
              <p>{media.message}</p>                     
              {/* <p>{media.downloaded}</p>                      */}
              <div className="flex flex-row w-full justify-end">          
                {/* <DownloadedComp media={media}/> */}
                {/* {media.downloaded==1 && (
                  <div className="flex flex-row gap-1">
                    <p className="text-base underline decoration-1 decoration-slate-400 underline-offset-2 text-slate-950">Download realizado!</p>
                  </div> 
                )}            */}
                
                <button onClick={()=>handlerData(media.id)} 
                className="bg-[#4d4ddb] text-white w-1/2 px-2 py-1 border rounded-lg">Baixar</button>
              </div>           
            </div>           
          </div>
        ))}
      </div>
    </div>
  )
}

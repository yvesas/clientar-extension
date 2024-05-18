/* eslint-disable @typescript-eslint/no-explicit-any */

import { IMessageObject } from "./IMessageObject";

function formatTimestamp(timestampString: string) {
  if(timestampString){  
    const [time, date] = timestampString.split(', ');
    const [hours, minutes] = time.split(':');
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }else{
    return '';
  }
}
export function sortMessages(messages: IMessageObject[], type = "ASC"): IMessageObject[] {    
    try {
      messages.sort((a:IMessageObject, b:IMessageObject) => { 
        const A_matches = (a.title || '').match(/\[([^[\]]*)\]/)?.[1];
        const A_formatted: string = formatTimestamp(A_matches as string)
        const timestampA = A_formatted ? Date.parse(A_formatted) : 0;
        
        const B_matches = (b.title || '').match(/\[([^[\]]*)\]/)?.[1];
        const B_formatted: string = formatTimestamp(B_matches as string)
        const timestampB = B_formatted ? Date.parse(B_formatted) : 0;  
        
        switch (type) {
          case "ASC":
            return Number(timestampA) - Number(timestampB);
          case "DESC":
            return Number(timestampB) - Number(timestampA);
          default:
            return 0;
            // throw new Error("O tipo de ordenação deve ser ASC ou DESC");
        }
      });
      return messages;
    } catch (err) {
      console.error('> Failed ordered messages.', err)
      return messages
    }
}

// export function sortMessages(messages: any, type = "ASC"): Promise<IMessageObject[]> {  
//   return new Promise((resolve, reject) => {
//     try {
//       messages.sort((a:any, b:any) => { 
//         const A_matches = (a.title || '').match(/\[([^[\]]*)\]/)?.[1];
//         const A_formatted: string = formatTimestamp(A_matches)
//         const timestampA = A_formatted ? Date.parse(A_formatted) : 0;
        
//         const B_matches = (b.title || '').match(/\[([^[\]]*)\]/)?.[1];
//         const B_formatted: string = formatTimestamp(B_matches)
//         const timestampB = B_formatted ? Date.parse(B_formatted) : 0;  
        
//         switch (type) {
//           case "ASC":
//             return Number(timestampA) - Number(timestampB);
//           case "DESC":
//             return Number(timestampB) - Number(timestampA);
//           default:
//             return messages;
//             // throw new Error("O tipo de ordenação deve ser ASC ou DESC");
//         }
//       });
//       resolve(messages);
//     } catch (err) {
//       console.error('> Failed ordered messages.', err)
//       reject(messages);
//     }
//   });
// }

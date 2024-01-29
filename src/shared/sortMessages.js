/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
// import { IMessageObject } from "./IMessageObject";
// export function sortMessages(messages: any, type = "ASC"): Promise<IMessageObject[]> {
//   return new Promise((resolve, reject) => {
//     try {
//       messages.sort((a:any, b:any) => {
//         const timestampA = Date.parse(a.match(/\[([^\[\]]*)\]/)[1]);
//         const timestampB = Date.parse(b.match(/\[([^\[\]]*)\]/)[1]);

//         switch (type) {
//           case "ASC":
//             return timestampA - timestampB;
//           case "DESC":
//             return timestampB - timestampA;
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

export function sortMessages(messages, type = "ASC") {
  return new Promise((resolve, reject) => {
    try {
      messages.sort((a, b) => {
        const timestampA = Date.parse(a.match(/\[([^\[\]]*)\]/)[1]);
        const timestampB = Date.parse(b.match(/\[([^\[\]]*)\]/)[1]);

        switch (type) {
          case "ASC":
            return timestampA - timestampB;
          case "DESC":
            return timestampB - timestampA;
          default:
            return messages;
            // throw new Error("O tipo de ordenação deve ser ASC ou DESC");
        }
      });
      resolve(messages);
    } catch (err) {
      console.error('> Failed ordered messages.', err);
      reject(messages);
    }
  });
}
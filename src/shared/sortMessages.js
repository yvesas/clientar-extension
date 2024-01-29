/* eslint-disable no-useless-escape */
export function sortMessages(messages, type = "ASC") {
  try{
  messages.sort((a, b) => {
    const timestampA = Date.parse((a || "").match(/\[([^\[\]]*)\]/)[1]);
    const timestampB = Date.parse((b || "").match(/\[([^\[\]]*)\]/)[1]);

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
  }catch(err) {
    return messages;
  }
}
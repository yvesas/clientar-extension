export const extractStrongText = async (text: string | null): Promise<string | null> => {
  if (!text) {
    return null;
  }
  const newText = text.replace(
    /<strong([^>]*)>(.*?)<\/strong>/gi,
    (_match, _attributes, innerText) => {
      return innerText.trim();
    }
  );
  return newText;
};

export const removeEmotions = (text:string|null) => {
  if(text){
    let newText = "";
    for (let i = 0; i < text.length; i++) {
        const noEmotes = /[^\n0-9a-zA-Z'"' '.,áÁãÃâÂàÀéÉêÊíÍóÓõÕôÔúÚçÇ?!:;#()/*\-[\]{}_ªº°=<>+&%$@]/gi;                    
        if (text[i].match(noEmotes) == null) {
          newText += text[i];
        }
    }
    return newText
  }else{
    return text
  }      
}

export const replaceEmoticon = async (
  text: string | null,
  altValue: string | undefined
): Promise<string | null> => {
  if (!altValue) {
    return text;
  }
  if (!text) {
    return text;
  }
  return new Promise((resolve, reject) => {
    try {
      const newText = text.replace(
        /<img[^>]*?alt="(.+?)"[^>]*?>/i,
        (match, alt) => {
          if (alt === altValue) {
            return ` ${altValue} `;
          } else {
            return match;
          }
        }
      );
      resolve(newText);
    } catch (error) {
      reject(error);
    }
  });
};

export const replaceLinkSource = async (
  text: string | null,
  hrefValue: string | undefined
): Promise<string | null> => {
  if (!hrefValue) {
    return text;
  }
  if (!text) {
    return text;
  }
  return new Promise((resolve, reject) => {
    try {
      const newText = text.replace(
        /<a[^>]*?\s*href="(.+?)"[^>]*?>\s*\n?\s*(?:.*?)<\/a>/i,
        (match, href) => {
          if (href.trim() === hrefValue.trim()) {
            return ` ${hrefValue.trim()} `;
          } else {
            return match;
          }
        }
      );
      resolve(newText);
    } catch (error) {
      reject(error);
    }
  });
};

export const validateText = (text: string) => {
  try {
    const regex = /\[(\d+):(\d+), (\d+)\/(\d+)\/(\d+)\]/g;
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Failed validate text. ", err);
  }
};

export const extractListItemText = async (text:string | null): Promise<string | null> => {  
  if (!text) {
    return text;
  }

  let liValues = text.replace(/<ul(.*?)>/g,"");
  liValues = liValues.replace("</ul>","")
  liValues = liValues.replace(/<li(.*?)>/g,"");
  liValues = liValues.replace(/<\/li>/g,"")
  liValues = liValues.replace(
    /<span([^>]*)>(.*?)<\/span>/gi,
    (_match, _attributes, innerText) => {
      return innerText.trim();      
    }
  );
  
  return liValues;
};



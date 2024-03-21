const getImage = (id) => {
  const divForHoverEvent = document.querySelector('[extapp="' + "ext-" + id + '"] div .UzMP7 .cm280p3y')
  const mouseoverEvent = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
  });
  divForHoverEvent.addEventListener("mouseover", () => {
    console.log('ROLOU O HOVER...')
    setTimeout(() => {
      const spanContext = document.querySelector('[extapp="' + "ext-" + id + '"] span ._1bGUW div') 
      spanContext.addEventListener("click", () => {
        setTimeout(() => {
          const menuContext = document.querySelector('div [role="application"] li [aria-label="Baixar"]')  ||
          document.querySelector('div [role="application"] li [aria-label="Download"]')
          console.log('CLICK no MENU CONTEXT, button Baixar', menuContext)
          menuContext.click();
         }, 500);
      });
      console.log('CLICK no SPAN CONTEXT')
      spanContext.click();
    }, 500);
  });
  console.log('INICIO...')
  divForHoverEvent.dispatchEvent(mouseoverEvent);
}
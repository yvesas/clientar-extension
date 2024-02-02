/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener(function(mensagem, remetente) {
  if (mensagem.acao === "obterDados") {
    // Obter os dados da aba atual
    const dados = "TESTE texto";

    // Enviar os dados para a aba que solicitou
    chrome.tabs.sendMessage(remetente.tab.id, {
      acao: "enviarDados",
      dados: dados
    });
  }
});
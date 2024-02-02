/* eslint-disable no-undef */

export function sendMessageByChromeAPI(text) {
  chrome.tabs.sendMessage({
    action: "sendText",
    message: text
  });
}
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

// // Background page -- background.js
// chrome.runtime.onConnect.addListener(function (devToolsConnection) {
//   // assign the listener function to a variable so we can remove it later
//   var devToolsListener = function (message, sender, sendResponse) {
//     // Inject a content script into the identified tab
//     chrome.tabs.executeScript(message.tabId, { file: message.scriptToInject });
//   };
//   // add the listener
//   devToolsConnection.onMessage.addListener(devToolsListener);

//   devToolsConnection.onDisconnect(function () {
//     devToolsConnection.onMessage.removeListener(devToolsListener);
//   });
// });

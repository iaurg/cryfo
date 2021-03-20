chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['coins'], function(items) {
    console.log('Settings retrieved', items);
  });
});
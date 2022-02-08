chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({
    active: true,
  });
});

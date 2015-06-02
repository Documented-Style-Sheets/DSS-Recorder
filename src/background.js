var recording = false;

function contentCallback(response) {
  switch(response.data) {
    case 'recording:started':
      recording = true;
      chrome.browserAction.setBadgeText({text: 'rec'});
      break;
    case 'recording:stopped':
      recording = false;
      chrome.browserAction.setBadgeText({text: ''});
      break;
  }
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      data: (recording ? 'recording:stop' : 'recording:start')
    }, contentCallback);
  });
});

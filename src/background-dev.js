var socket = require('socket.io-client')('http://localhost:35729');

socket.on('fileChange', function(data) {
  chrome.management.getSelf(function(self) {
    var id = self.id;
    chrome.runtime.reload();
  });
});

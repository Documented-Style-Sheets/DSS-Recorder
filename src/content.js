var DSS = DSS || {};

DSS.EVENTS = ['click', 'mouseover', 'mouseout', 'mousemove', 'scroll'];

DSS.record = function record() {
  DSS.EVENTS.forEach(function(evt) {
    document.addEventListener(evt, DSS.eventHandler);
  });
}

DSS.stop = function stop() {
  DSS.EVENTS.forEach(function(evt) {
    document.removeEventListener(evt, DSS.eventHandler);
  });
}

DSS.eventHandler = function(e) {
  console.log(e.type);
}

chrome.runtime.onMessage.addListener(function(message, sender, response) {
  switch(message.data) {
    case 'recording:start':
      DSS.record();
      response({data: 'recording:started'});
      break;
    case 'recording:stop':
      DSS.stop();
      response({data: 'recording:stopped'});
      break;
  }
});

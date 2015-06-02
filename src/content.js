var DSS = DSS || {};

DSS.EVENTS = ['click', 'mouseover', 'mouseout', 'mousemove', 'scroll'];
DSS.THROTTLE_LIMIT = 300;

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

DSS.eventHandler = _.throttle(function(e) {
  var computed = window.getComputedStyle(e.target);
  var styles = _.omit(computed, function(v, k) {
    return !isNaN(parseInt(k));
  });
  console.log(styles);
}, DSS.THROTTLE_LIMIT);

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

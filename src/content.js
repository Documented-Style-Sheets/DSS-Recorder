var _        = require('lodash');
var DSSEvent = require('./dss_event.js');
var DSS      = DSS || {};

/* --------------------- Constants --------------------- */
DSS.WATCH_EVENTS = ['click', 'mouseover', 'mouseout', 'mousemove', 'scroll'];
DSS.THROTTLE_LIMIT = 300;

/* --------------------- Variables --------------------- */
DSS.eventCollection = [];
DSS.startTime;

/* --------------------- Methods --------------------- */
DSS.record = function record() {
  DSS.WATCH_EVENTS.forEach(function(evt) {
    document.addEventListener(evt, DSS.eventHandler);
  });

  DSS.startTime = Date.now();
}

DSS.stop = function stop() {
  DSS.WATCH_EVENTS.forEach(function(evt) {
    document.removeEventListener(evt, DSS.eventHandler);
  });
}

DSS.eventHandler = _.throttle(function(e) {
  var computed = window.getComputedStyle(e.target);
  var dssEvent = new DSSEvent({
    type: e.type,
    time: Date.now() - DSS.startTime,
    styles: computed
  });
  DSS.eventCollection.push(dssEvent);
}, DSS.THROTTLE_LIMIT);

/* -----------------------------------------------------
 * Handle messages from the background script
 * -----------------------------------------------------*/
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

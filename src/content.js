var _        = require('lodash');
var DSS      = DSS || {};
var DSSEvent = require('./dss_event.js');
var DSSEventCollection = require('./dss_event_collection.js');

/* --------------------- Constants --------------------- */
DSS.WATCH_EVENTS = ['click', 'mouseover', 'mouseout', 'mousemove', 'scroll', 'transitionend'];
DSS.THROTTLE_LIMIT = 300;

/* --------------------- Variables --------------------- */
DSS.eventCollection = new DSSEventCollection();
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

DSS.eventHandler = _.throttle(function eventHandler(e) {
  var computed = window.getComputedStyle(e.target);
  var dssEvent = new DSSEvent({
    type: e.type,
    time: Date.now() - DSS.startTime,
    styles: computed,
    el: e.target
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

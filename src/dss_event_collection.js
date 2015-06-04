var _        = require('lodash');
var DSSEvent = require('./dss_event.js');
var proto    = {};

function DSSEventCollection() {
}

proto.dssEvents = [];

proto.push = function(dssEvent) {
  this.dssEvents.push(dssEvent);
}

proto.fetchByElement = function(el) {
  return _.filter(this.dssEvents, function(dssEvent) {
    return dssEvent.el === el;
  });
}

proto.fetchByTime = function() {
  return _.sortBy(this.dssEvents, 'time');
}

proto.fetchUniqueElements = function() {
  return _.chain(this.dssEvents).uniq(function(dssEvent) {
    return dssEvent.el;
  }).pluck('el').value();
}

proto.createElementGroupings = function() {
  var els = this.fetchUniqueElements();
  return els.map(function(el, i) {
    return {
      el: el,
      events: this.fetchByElement(el)
    };
  }, this);
}

proto.groupedByElement = function() {
  var groupings = this.createElementGroupings();
  // Prepend an empty event with the default styles
  // to calculate the delta from index 0..1
  return groupings.map(function(group) {
    group.events.unshift(new DSSEvent({el: group.el}));
    return group;
  })
}

proto.calculateDeltas = function() {
  this.groupedByElement().forEach(function(group) {
    group.events.forEach(function(dssEvent, i) {
      if(i === 0) return;
      dssEvent.delta = dssEvent.calcStyleDelta(group.events[i-1].styles);
    });
  });
}

proto.fetchDeltas = function() {
  this.calculateDeltas();
  return _.filter(this.fetchByTime(), function(evt) {
    return _.keys(evt.delta).length;
  });
}

DSSEventCollection.prototype = proto;
module.exports = DSSEventCollection;

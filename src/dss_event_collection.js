var _     = require('lodash');
var proto = {};

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

proto.fetchUniqueElements = function() {
  return _.chain(this.dssEvents).uniq(function(dssEvent) {
    return dssEvent.el;
  }).pluck('el').value();
}

DSSEventCollection.prototype = proto;
module.exports = DSSEventCollection;

var _     = require('lodash');
var proto = {}; // Our soon-to-be prototype shorthand

function DSSEvent(params) {
  this.el = params.el;
  this.type = params.type || '';
  this.time = params.time || 0;
  this.styles = this.omitExtraneousKeys(params.styles || window.getComputedStyle(params.el));
  this.delta;
}

proto.omitExtraneousKeys = function(obj) {
  return _.omit(obj, function(v, k) {
    return !isNaN(parseInt(k)) || k === 'cssText';
  })
}

proto.calcStyleDelta = function(prevStyles) {
  return _.omit(this.styles, function(v, k) {
    return prevStyles[k] === v;
  });
}

DSSEvent.prototype = proto;
module.exports = DSSEvent;

var _     = require('lodash');
var proto = {}; // Our soon-to-be prototype shorthand

function DSSEvent(params) {
  this.type = params.type;
  this.time = params.time;
  this.styles = this.omitExtraneousKeys(params.styles)
  this.el = params.el;
}

proto.omitExtraneousKeys = function(obj) {
  return _.omit(obj, function(v, k) {
    return !isNaN(parseInt(k));
  })
}

DSSEvent.prototype = proto;
module.exports = DSSEvent;

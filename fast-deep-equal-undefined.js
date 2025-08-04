'use strict';

// Modified version of fast-deep-equal that treats missing properties as undefined
module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    var bLength = Object.keys(b).length;
    
    // Fast path: if same number of keys, use original algorithm
    if (length === bLength) {
      for (i = length; i-- !== 0;)
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

      for (i = length; i-- !== 0;) {
        var key = keys[i];
        if (!equal(a[key], b[key])) return false;
      }
      
      return true;
    }
    
    // Slow path: different number of keys, need to check all from both objects
    var keysB = Object.keys(b);
    var allKeys = new Set([...keys, ...keysB]);
    
    // Compare all properties, treating missing ones as undefined
    for (var key of allKeys) {
      var aVal = a.hasOwnProperty(key) ? a[key] : undefined;
      var bVal = b.hasOwnProperty(key) ? b[key] : undefined;
      
      if (!equal(aVal, bVal)) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};
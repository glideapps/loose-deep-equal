'use strict';

/**
 * loose-deep-equal
 * 
 * Fast deep equality comparison that treats missing properties as equal to undefined.
 * Based on fast-deep-equal with modifications for loose equality semantics.
 * 
 * @param {any} a - First value to compare
 * @param {any} b - Second value to compare
 * @returns {boolean} True if values are equal (with missing properties treated as undefined)
 */
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
    
    // Handle objects with null prototype
    var aValueOf = a.valueOf;
    var bValueOf = b.valueOf;
    if (aValueOf && bValueOf && aValueOf !== Object.prototype.valueOf) {
      return aValueOf.call(a) === bValueOf.call(b);
    }
    
    var aToString = a.toString;
    var bToString = b.toString;
    if (aToString && bToString && aToString !== Object.prototype.toString) {
      return aToString.call(a) === bToString.call(b);
    }

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
    // First iteration: check all keys from object a
    for (i = length; i-- !== 0;) {
      var key = keys[i];
      var aVal = a[key];
      var bVal = Object.prototype.hasOwnProperty.call(b, key) ? b[key] : undefined;
      
      if (!equal(aVal, bVal)) return false;
    }
    
    // Second iteration: check keys from b that are NOT in a
    var keysB = Object.keys(b);
    for (i = keysB.length; i-- !== 0;) {
      var key = keysB[i];
      if (!Object.prototype.hasOwnProperty.call(a, key)) {
        // a doesn't have this key, so aVal is undefined
        // bVal is b[key] (we know it exists since it's in keysB)
        if (!equal(undefined, b[key])) return false;
      }
      // If a has the key, we already checked it in the first loop
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};
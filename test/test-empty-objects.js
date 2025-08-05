const equal = require('fast-deep-equal');
const looseEqual = require('../src/index');

console.log('Testing empty objects handling\n');

// Test 1: Two empty objects
const empty1 = {};
const empty2 = {};

console.log('Test 1: Two empty objects');
console.log('fast-deep-equal:', equal(empty1, empty2));
console.log('loose-deep-equal:', looseEqual(empty1, empty2));
console.log();

// Test 2: Empty object with valueOf
const withValueOf = {
  valueOf: function() { return 42; }
};
const empty3 = {};

console.log('Test 2: Object with valueOf vs empty object');
console.log('fast-deep-equal:', equal(withValueOf, empty3));
console.log('loose-deep-equal:', looseEqual(withValueOf, empty3));
console.log();

// Test 3: Empty object with toString
const withToString = {
  toString: function() { return 'custom'; }
};
const empty4 = {};

console.log('Test 3: Object with toString vs empty object');
console.log('fast-deep-equal:', equal(withToString, empty4));
console.log('loose-deep-equal:', looseEqual(withToString, empty4));
console.log();

// Test 4: Two objects with same toString
const obj1 = { toString: function() { return 'same'; } };
const obj2 = { toString: function() { return 'same'; } };

console.log('Test 4: Two objects with same toString');
console.log('fast-deep-equal:', equal(obj1, obj2));
console.log('loose-deep-equal:', looseEqual(obj1, obj2));
console.log();

// Test 5: Check if empty objects share default toString
console.log('Test 5: Default toString comparison');
console.log('empty1.toString():', empty1.toString());
console.log('empty2.toString():', empty2.toString());
console.log('empty1.toString === empty2.toString:', empty1.toString === empty2.toString);
console.log('empty1.toString === Object.prototype.toString:', empty1.toString === Object.prototype.toString);
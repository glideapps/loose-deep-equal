const equal = require('fast-deep-equal');
const looseEqual = require('../src/index');

console.log('Testing prototype pollution vulnerability\n');

// Test 1: __proto__ property
const malicious1 = {
  __proto__: { isAdmin: true }
};
const normal1 = {};

console.log('Test 1: __proto__ property');
console.log('fast-deep-equal:', equal(malicious1, normal1));
console.log('loose-deep-equal:', looseEqual(malicious1, normal1));
console.log('Object.prototype.isAdmin after:', Object.prototype.isAdmin);
console.log();

// Clean up
delete Object.prototype.isAdmin;

// Test 2: constructor.prototype
const malicious2 = {
  constructor: {
    prototype: { isAdmin: true }
  }
};
const normal2 = {};

console.log('Test 2: constructor.prototype property');
console.log('fast-deep-equal:', equal(malicious2, normal2));
console.log('loose-deep-equal:', looseEqual(malicious2, normal2));
console.log();

// Test 3: Nested __proto__
const malicious3 = {
  nested: {
    __proto__: { isAdmin: true }
  }
};
const normal3 = {
  nested: {}
};

console.log('Test 3: Nested __proto__ property');
console.log('fast-deep-equal:', equal(malicious3, normal3));
console.log('loose-deep-equal:', looseEqual(malicious3, normal3));
console.log('Object.prototype.isAdmin after:', Object.prototype.isAdmin);
console.log();

// Clean up
delete Object.prototype.isAdmin;

// Test 4: Check if __proto__ is compared as a regular property
const obj1 = { __proto__: { foo: 'bar' } };
const obj2 = { __proto__: { foo: 'baz' } };
const obj3 = { __proto__: { foo: 'bar' } };

console.log('Test 4: __proto__ as regular property comparison');
console.log('fast-deep-equal obj1 vs obj2:', equal(obj1, obj2));
console.log('fast-deep-equal obj1 vs obj3:', equal(obj1, obj3));
console.log('loose-deep-equal obj1 vs obj2:', looseEqual(obj1, obj2));
console.log('loose-deep-equal obj1 vs obj3:', looseEqual(obj1, obj3));
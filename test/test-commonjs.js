// Test CommonJS import
const looseEqual = require('../src/index.js');

console.log('Testing CommonJS import...\n');

// Test basic functionality
const test1 = looseEqual({ a: 1 }, { a: 1, b: undefined });
console.log('looseEqual({ a: 1 }, { a: 1, b: undefined }):', test1);
console.log('Expected: true');
console.log(test1 === true ? '✓ PASS' : '✗ FAIL');

console.log('\nCommonJS import works correctly!');
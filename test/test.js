'use strict';

const looseEqual = require('../src/index');
const assert = require('assert');

console.log('Running loose-deep-equal tests...\n');

let passed = 0;
let failed = 0;

function test(name, a, b, expected) {
  let result;
  try {
    result = looseEqual(a, b);
    assert.strictEqual(result, expected);
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  Expected: ${expected}, Got: ${result}`);
    console.log(`  a:`, a);
    console.log(`  b:`, b);
    failed++;
  }
}

// Core functionality tests
console.log('=== Core Functionality ===');
test('Missing property equals undefined', { a: 1 }, { a: 1, b: undefined }, true);
test('Undefined equals missing property', { a: 1, b: undefined }, { a: 1 }, true);
test('Both missing same property', { a: 1 }, { a: 1 }, true);
test('Different values', { a: 1 }, { a: 2 }, false);
test('Null is not undefined', { a: null }, { a: undefined }, false);
test('Null is not missing', { a: null }, {}, false);

// Nested objects
console.log('\n=== Nested Objects ===');
test('Nested missing equals undefined', 
  { x: { y: 1 } }, 
  { x: { y: 1, z: undefined } }, 
  true
);
test('Deep nesting with undefined',
  { a: { b: { c: 1 } } },
  { a: { b: { c: 1, d: undefined } } },
  true
);

// Arrays
console.log('\n=== Arrays ===');
test('Equal arrays', [1, 2, 3], [1, 2, 3], true);
test('Different arrays', [1, 2, 3], [1, 2, 4], false);
test('Arrays with undefined', [1, undefined, 3], [1, undefined, 3], true);

// Edge cases
console.log('\n=== Edge Cases ===');
test('Empty objects', {}, {}, true);
test('Empty vs undefined property', {}, { a: undefined }, true);
test('NaN equality', NaN, NaN, true);
test('Positive and negative zero', 0, -0, true);
test('Date objects', new Date('2024-01-01'), new Date('2024-01-01'), true);
test('RegExp objects', /test/g, /test/g, true);
test('Different RegExp flags', /test/g, /test/i, false);

// Null prototype objects
console.log('\n=== Null Prototype Objects ===');
const nullProto1 = Object.create(null);
nullProto1.x = 1;
const nullProto2 = Object.create(null);
nullProto2.x = 1;
nullProto2.y = undefined;
test('Null prototype objects', nullProto1, nullProto2, true);

// Malicious objects
console.log('\n=== Security Tests ===');
const malicious = { x: 1, hasOwnProperty: 'gotcha!' };
const normal = { x: 1, hasOwnProperty: 'gotcha!', y: undefined };
test('Objects with overridden hasOwnProperty', malicious, normal, true);

// Performance test
console.log('\n=== Performance Test ===');
const bigObj1 = {};
const bigObj2 = {};
for (let i = 0; i < 1000; i++) {
  if (i % 10 === 0) {
    bigObj1[`key${i}`] = undefined;
    // bigObj2 doesn't have this key - missing
  } else {
    bigObj1[`key${i}`] = i;
    bigObj2[`key${i}`] = i;
  }
}

const start = Date.now();
const bigResult = looseEqual(bigObj1, bigObj2);
const time = Date.now() - start;
test('Large objects (1000 properties)', bigObj1, bigObj2, true);
console.log(`  Performance: ${time}ms for 1000 properties`);

// Summary
console.log('\n' + '='.repeat(40));
console.log(`Tests passed: ${passed}`);
console.log(`Tests failed: ${failed}`);
console.log(`Total tests: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
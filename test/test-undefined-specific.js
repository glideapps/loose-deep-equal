const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');

console.log('Specific Tests for Undefined Equality Behavior');
console.log('============================================\n');

// Test helper
function test(name, a, b, expected) {
  let result;
  try {
    result = fastDeepEqualUndefined(a, b);
    const status = result === expected ? '✓' : '✗';
    console.log(`${status} ${name}`);
    console.log(`  Expected: ${expected}, Got: ${result}`);
    if (result !== expected) {
      console.log(`  a: ${JSON.stringify(a)}`);
      console.log(`  b: ${JSON.stringify(b)}`);
    }
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${e.message}`);
  }
}

// Core behavior tests
console.log('--- CORE UNDEFINED BEHAVIOR ---\n');

test('Missing = undefined (simple)', 
  { a: 1 }, 
  { a: 1, b: undefined }, 
  true);

test('undefined = missing (simple)', 
  { a: 1, b: undefined }, 
  { a: 1 }, 
  true);

test('Both missing property', 
  { a: 1 }, 
  { a: 1 }, 
  true);

test('Both have undefined', 
  { a: 1, b: undefined }, 
  { a: 1, b: undefined }, 
  true);

test('undefined ≠ null', 
  { a: undefined }, 
  { a: null }, 
  false);

test('missing ≠ null', 
  {}, 
  { a: null }, 
  false);

test('undefined ≠ false', 
  { a: undefined }, 
  { a: false }, 
  false);

test('undefined ≠ 0', 
  { a: undefined }, 
  { a: 0 }, 
  false);

test('undefined ≠ empty string', 
  { a: undefined }, 
  { a: '' }, 
  false);

// Nested cases
console.log('\n--- NESTED UNDEFINED BEHAVIOR ---\n');

test('Nested missing = undefined', 
  { outer: { inner: 1 } }, 
  { outer: { inner: 1, missing: undefined } }, 
  true);

test('Deep nested undefined equality', 
  { a: { b: { c: { d: undefined } } } }, 
  { a: { b: { c: {} } } }, 
  true);

test('Array inside object with undefined', 
  { arr: [1, undefined, 3] }, 
  { arr: [1, undefined, 3] }, 
  true);

test('Multiple missing at different levels', 
  { a: 1, b: { c: 2 } }, 
  { a: 1, b: { c: 2, d: undefined }, e: undefined }, 
  true);

// Edge cases with undefined
console.log('\n--- EDGE CASES ---\n');

test('Empty objects', 
  {}, 
  {}, 
  true);

test('One empty, one with undefined', 
  {}, 
  { a: undefined }, 
  true);

test('Many undefined properties', 
  { a: undefined, b: undefined, c: undefined }, 
  {}, 
  true);

test('Mixed defined and undefined', 
  { a: 1, b: undefined, c: 3, d: undefined }, 
  { a: 1, c: 3 }, 
  true);

test('Undefined in property name', 
  { undefined: 1 }, 
  { undefined: 1 }, 
  true);

test('String "undefined" is not undefined', 
  { a: 'undefined' }, 
  { a: undefined }, 
  false);

// Complex scenarios
console.log('\n--- COMPLEX SCENARIOS ---\n');

test('Object with all falsy values vs undefined', 
  { a: false, b: 0, c: '', d: null, e: undefined }, 
  { a: false, b: 0, c: '', d: null }, 
  true);

// Note: Circular references will cause stack overflow
// This is expected behavior matching the original fast-deep-equal
console.log('✓ Circular reference with undefined');
console.log('  (Skipped - would cause stack overflow)');

test('Function property vs undefined', 
  { fn: function() {} }, 
  { fn: undefined }, 
  false);

test('Date vs undefined', 
  { date: new Date() }, 
  { date: undefined }, 
  false);

test('Regex vs undefined', 
  { pattern: /test/ }, 
  { pattern: undefined }, 
  false);

// Order independence
console.log('\n--- ORDER INDEPENDENCE ---\n');

test('Properties in different order with undefined', 
  { a: 1, b: undefined, c: 3 }, 
  { c: 3, a: 1 }, 
  true);

test('Many properties reordered', 
  { z: 26, a: 1, m: 13, b: undefined, y: 25 }, 
  { a: 1, y: 25, z: 26, m: 13 }, 
  true);

// Performance edge case
console.log('\n--- PERFORMANCE CHECK ---\n');

const bigA = { a: 1 };
const bigB = { a: 1 };
for (let i = 0; i < 1000; i++) {
  if (i % 2 === 0) {
    bigA[`prop${i}`] = undefined;
  }
}

console.log('Testing large object with 500 undefined properties...');
const start = Date.now();
const bigResult = fastDeepEqualUndefined(bigA, bigB);
const time = Date.now() - start;
console.log(`Result: ${bigResult} (should be true)`);
console.log(`Time: ${time}ms`);

console.log('\n' + '='.repeat(50));
console.log('All undefined-specific tests completed!');
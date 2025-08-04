const fastDeepEqual = require('fast-deep-equal');
const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');

// Helper to run test and show results
function runTest(name, a, b, description) {
  console.log(`\n${name}:`);
  if (description) console.log(`  ${description}`);
  
  try {
    console.log(`  a: ${typeof a === 'symbol' ? a.toString() : JSON.stringify(a)}`);
  } catch (e) {
    console.log(`  a: [Cannot stringify: ${e.message}]`);
  }
  
  try {
    console.log(`  b: ${typeof b === 'symbol' ? b.toString() : JSON.stringify(b)}`);
  } catch (e) {
    console.log(`  b: [Cannot stringify: ${e.message}]`);
  }
  
  let originalResult, modifiedResult;
  
  try {
    originalResult = fastDeepEqual(a, b);
    console.log(`  Original: ${originalResult}`);
  } catch (e) {
    originalResult = `Error: ${e.message}`;
    console.log(`  Original: ${originalResult}`);
  }
  
  try {
    modifiedResult = fastDeepEqualUndefined(a, b);
    console.log(`  Modified: ${modifiedResult}`);
  } catch (e) {
    modifiedResult = `Error: ${e.message}`;
    console.log(`  Modified: ${modifiedResult}`);
  }
  
  if (originalResult !== modifiedResult && !originalResult.toString().startsWith('Error') && !modifiedResult.toString().startsWith('Error')) {
    console.log(`  ⚠️  BEHAVIOR DIFFERENCE!`);
  }
}

console.log('Comprehensive Edge Case Tests for fast-deep-equal-undefined');
console.log('===========================================================');

// 1. Prototype pollution attempts
console.log('\n--- PROTOTYPE POLLUTION & SPECIAL PROPERTIES ---');

runTest('__proto__ property', 
  { x: 1, __proto__: { y: 2 } },
  { x: 1 },
  'Object with __proto__ property vs without');

runTest('constructor property',
  { x: 1, constructor: Array },
  { x: 1, constructor: Object },
  'Objects with different constructor properties');

runTest('prototype property',
  { x: 1, prototype: { foo: 'bar' } },
  { x: 1 },
  'Object with prototype property vs without');

// 2. Symbol properties
console.log('\n--- SYMBOL PROPERTIES ---');

const sym1 = Symbol('test');
const sym2 = Symbol('test');
const obj1WithSym = { x: 1, [sym1]: 'value' };
const obj2WithSym = { x: 1, [sym1]: 'value' };
const obj3WithSym = { x: 1, [sym2]: 'value' };
const objNoSym = { x: 1 };

runTest('Same symbol property',
  obj1WithSym,
  obj2WithSym,
  'Objects with same symbol should be equal');

runTest('Different symbols',
  obj1WithSym,
  obj3WithSym,
  'Objects with different symbols');

runTest('Symbol vs no symbol',
  obj1WithSym,
  objNoSym,
  'Object with symbol vs without (symbols are not enumerable)');

// 3. Non-enumerable properties
console.log('\n--- NON-ENUMERABLE PROPERTIES ---');

const objWithNonEnum = Object.create(null, {
  x: { value: 1, enumerable: true },
  hidden: { value: 'secret', enumerable: false }
});
const objWithoutNonEnum = { x: 1 };

runTest('Non-enumerable properties',
  objWithNonEnum,
  objWithoutNonEnum,
  'Non-enumerable properties should be ignored');

// 4. Property descriptors and getters/setters
console.log('\n--- GETTERS/SETTERS ---');

const objWithGetter = {
  x: 1,
  get y() { return 2; }
};
const objPlain = { x: 1, y: 2 };

runTest('Getter vs plain property',
  objWithGetter,
  objPlain,
  'Getter that returns same value vs plain property');

const objWithThrowingGetter = {
  x: 1,
  get y() { throw new Error('Getter exploded!'); }
};

runTest('Throwing getter',
  objWithThrowingGetter,
  { x: 1 },
  'Object with throwing getter vs without property');

// 5. Circular references
console.log('\n--- CIRCULAR REFERENCES ---');

const circular1 = { x: 1 };
circular1.self = circular1;

const circular2 = { x: 1 };
circular2.self = circular2;

runTest('Circular references',
  circular1,
  circular2,
  'Objects with circular references');

// 6. Objects with null prototype
console.log('\n--- NULL PROTOTYPE ---');

const nullProto1 = Object.create(null);
nullProto1.x = 1;
nullProto1.y = undefined;

const nullProto2 = Object.create(null);
nullProto2.x = 1;

runTest('Null prototype objects',
  nullProto1,
  nullProto2,
  'Objects created with Object.create(null)');

// 7. Proxy objects
console.log('\n--- PROXY OBJECTS ---');

const target = { x: 1 };
const proxy = new Proxy(target, {
  get(target, prop) {
    if (prop === 'y') return undefined;
    return target[prop];
  },
  has(target, prop) {
    return prop in target || prop === 'y';
  },
  ownKeys(target) {
    return [...Object.keys(target), 'y'];
  }
});

runTest('Proxy with virtual properties',
  proxy,
  { x: 1, y: undefined },
  'Proxy that pretends to have undefined property');

// 8. Different types with valueOf/toString
console.log('\n--- VALUEOF AND TOSTRING ---');

const objWithValueOf = {
  valueOf() { return 42; },
  x: 1
};
const objPlainValueOf = { x: 1 };

runTest('Custom valueOf',
  objWithValueOf,
  objPlainValueOf,
  'Object with custom valueOf vs without');

// 9. Weird property names
console.log('\n--- WEIRD PROPERTY NAMES ---');

runTest('Empty string key',
  { '': 1, x: 2 },
  { x: 2 },
  'Object with empty string key vs without');

runTest('Number-like string keys',
  { '0': 'a', '1': 'b', length: 2 },
  ['a', 'b'],
  'Object with array-like keys vs actual array');

runTest('Unicode property names',
  { '🦄': 1, '你好': 2 },
  { '🦄': 1 },
  'Objects with unicode keys, one missing');

// 10. Undefined as object property
console.log('\n--- UNDEFINED HANDLING SPECIAL CASES ---');

runTest('Undefined in array',
  [1, undefined, 3],
  [1, , 3],  // sparse array
  'Array with undefined vs sparse array');

runTest('Multiple undefined levels',
  { a: { b: undefined, c: { d: undefined } } },
  { a: { c: {} } },
  'Nested objects with undefined at multiple levels');

runTest('Undefined vs null vs missing',
  { a: undefined, b: null },
  { b: null, c: undefined },
  'Mix of undefined, null, and missing properties');

// 11. Object identity special case
console.log('\n--- OBJECT IDENTITY ---');

const sharedObj = { nested: true };
const withShared1 = { x: 1, ref: sharedObj };
const withShared2 = { x: 1, ref: sharedObj };

runTest('Shared object reference',
  withShared1,
  withShared2,
  'Objects containing reference to same object');

// 12. Edge case with object constructors
console.log('\n--- CONSTRUCTOR EDGE CASES ---');

runTest('Array vs Array-like',
  [],
  { length: 0, constructor: Array },
  'Empty array vs array-like object with Array constructor');

runTest('Date objects',
  new Date('2024-01-01'),
  new Date('2024-01-01'),
  'Date objects with same time');

runTest('RegExp with undefined',
  { pattern: /test/g },
  { pattern: /test/g, flags: undefined },
  'Object with RegExp vs same with undefined property');

// 13. Property order
console.log('\n--- PROPERTY ORDER ---');

runTest('Different property order',
  { a: 1, b: 2, c: 3 },
  { c: 3, a: 1, b: 2 },
  'Same properties in different order');

// 14. Very deep nesting
console.log('\n--- DEEP NESTING ---');

let deep1 = { x: undefined };
let deep2 = {};
for (let i = 0; i < 100; i++) {
  deep1 = { next: deep1 };
  deep2 = { next: deep2 };
}

runTest('Very deep nesting',
  deep1,
  deep2,
  '100 levels deep with undefined at bottom');

// 15. Mixed types that might be coerced
console.log('\n--- TYPE COERCION TRAPS ---');

runTest('Number vs String property',
  { 1: 'value' },
  { '1': 'value' },
  'Numeric vs string keys (should be same)');

runTest('0 vs -0',
  { x: 0 },
  { x: -0 },
  'Positive zero vs negative zero');

runTest('NaN values',
  { x: NaN },
  { x: NaN },
  'Objects containing NaN');

console.log('\n' + '='.repeat(60));
console.log('Edge case testing completed!');
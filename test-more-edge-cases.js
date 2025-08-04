const fastDeepEqual = require('fast-deep-equal');
const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');
const fastDeepEqualUndefinedV2 = require('./fast-deep-equal-undefined-v2');

// Helper to test all three versions
function testAll(name, a, b, description) {
  console.log(`\n${name}:`);
  if (description) console.log(`  ${description}`);
  
  // Try to display the objects
  try {
    const aStr = typeof a === 'symbol' ? a.toString() : 
                 typeof a === 'function' ? a.toString() :
                 JSON.stringify(a);
    console.log(`  a: ${aStr}`);
  } catch (e) {
    console.log(`  a: [Cannot display: ${e.message}]`);
  }
  
  try {
    const bStr = typeof b === 'symbol' ? b.toString() : 
                 typeof b === 'function' ? b.toString() :
                 JSON.stringify(b);
    console.log(`  b: ${bStr}`);
  } catch (e) {
    console.log(`  b: [Cannot display: ${e.message}]`);
  }
  
  // Test original
  try {
    const result = fastDeepEqual(a, b);
    console.log(`  Original: ${result}`);
  } catch (e) {
    console.log(`  Original: Error - ${e.message}`);
  }
  
  // Test modified v1
  try {
    const result = fastDeepEqualUndefined(a, b);
    console.log(`  Modified v1: ${result}`);
  } catch (e) {
    console.log(`  Modified v1: Error - ${e.message}`);
  }
  
  // Test modified v2
  try {
    const result = fastDeepEqualUndefinedV2(a, b);
    console.log(`  Modified v2: ${result}`);
  } catch (e) {
    console.log(`  Modified v2: Error - ${e.message}`);
  }
}

console.log('Additional Edge Case Tests');
console.log('=========================');

// 1. Sparse arrays
console.log('\n--- SPARSE ARRAYS ---');

const sparse1 = [1, , 3];  // sparse array with hole
const sparse2 = [1, undefined, 3];  // dense array with undefined
sparse1.length = 5;  // extend with more holes

testAll('Sparse vs dense array',
  sparse1,
  sparse2,
  'Sparse array holes vs explicit undefined');

testAll('Extended sparse arrays',
  sparse1,
  [1, undefined, 3, undefined, undefined],
  'Sparse array with length 5 vs dense array');

// 2. Array with extra properties
console.log('\n--- ARRAYS WITH PROPERTIES ---');

const arr1 = [1, 2, 3];
arr1.foo = 'bar';
const arr2 = [1, 2, 3];
arr2.foo = 'bar';
arr2.baz = undefined;

testAll('Arrays with extra properties',
  arr1,
  arr2,
  'Arrays should only compare numeric indices');

// 3. Functions
console.log('\n--- FUNCTIONS ---');

function fn1() { return 1; }
function fn2() { return 1; }
const fn3 = fn1;

testAll('Different function instances',
  fn1,
  fn2,
  'Functions with same body but different instances');

testAll('Same function reference',
  fn1,
  fn3,
  'Same function reference should be equal');

// 4. Primitive wrappers
console.log('\n--- PRIMITIVE WRAPPERS ---');

testAll('Number objects',
  new Number(42),
  new Number(42),
  'Number wrapper objects with same value');

testAll('String objects',
  new String('hello'),
  new String('hello'),
  'String wrapper objects with same value');

testAll('Boolean objects',
  new Boolean(true),
  new Boolean(true),
  'Boolean wrapper objects with same value');

// 5. Objects with numeric keys
console.log('\n--- NUMERIC KEYS ---');

testAll('Numeric vs string keys',
  { 1: 'a', 2: 'b' },
  { '1': 'a', '2': 'b' },
  'JavaScript treats numeric and string keys the same');

testAll('Out of order numeric keys',
  { 2: 'b', 1: 'a', 10: 'c' },
  { 10: 'c', 1: 'a', 2: 'b' },
  'Order should not matter');

// 6. Special number values
console.log('\n--- SPECIAL NUMBERS ---');

testAll('Infinity values',
  { x: Infinity, y: -Infinity },
  { x: Infinity, y: -Infinity },
  'Positive and negative infinity');

testAll('Different zeros with missing property',
  { x: 0 },
  { x: -0, y: undefined },
  'Should detect 0 vs -0 difference and missing vs undefined');

// 7. Typed arrays
console.log('\n--- TYPED ARRAYS ---');

testAll('Uint8Array',
  new Uint8Array([1, 2, 3]),
  new Uint8Array([1, 2, 3]),
  'Typed arrays with same values');

testAll('Different typed arrays',
  new Uint8Array([1, 2, 3]),
  new Uint16Array([1, 2, 3]),
  'Different typed array types');

// 8. Objects that lie about their properties
console.log('\n--- DECEPTIVE OBJECTS ---');

const liar = {
  x: 1,
  get y() {
    // Return different values each time
    return Math.random() > 0.5 ? 2 : 3;
  }
};

testAll('Non-deterministic getter',
  liar,
  { x: 1, y: 2 },
  'Getter that returns random values');

// 9. Property defined as undefined
console.log('\n--- EXPLICIT UNDEFINED ---');

const explicitUndef = {};
Object.defineProperty(explicitUndef, 'x', {
  value: undefined,
  enumerable: true,
  writable: true,
  configurable: true
});

testAll('Explicit undefined property',
  explicitUndef,
  {},
  'Property explicitly set to undefined vs missing');

// 10. Objects with different prototypes
console.log('\n--- PROTOTYPE DIFFERENCES ---');

function CustomClass() {
  this.x = 1;
}
CustomClass.prototype.y = 2;

const custom1 = new CustomClass();
const custom2 = { x: 1 };

testAll('Instance vs plain object',
  custom1,
  custom2,
  'Object with custom prototype vs plain object');

// 11. Error objects
console.log('\n--- ERROR OBJECTS ---');

const err1 = new Error('test');
const err2 = new Error('test');

testAll('Error objects',
  err1,
  err2,
  'Error objects with same message');

// 12. Maps and Sets (if supported)
console.log('\n--- MAPS AND SETS ---');

if (typeof Map !== 'undefined') {
  const map1 = new Map([['a', 1], ['b', 2]]);
  const map2 = new Map([['a', 1], ['b', 2]]);
  
  testAll('Map objects',
    map1,
    map2,
    'Maps with same key-value pairs');
}

if (typeof Set !== 'undefined') {
  const set1 = new Set([1, 2, 3]);
  const set2 = new Set([1, 2, 3]);
  
  testAll('Set objects',
    set1,
    set2,
    'Sets with same values');
}

// 13. Objects with Symbol.toStringTag
console.log('\n--- SYMBOL.TOSTRINGTAG ---');

const tagged1 = { x: 1 };
tagged1[Symbol.toStringTag] = 'Custom';

const tagged2 = { x: 1 };

testAll('Symbol.toStringTag',
  tagged1,
  tagged2,
  'Object with custom toStringTag vs without');

// 14. Frozen and sealed objects
console.log('\n--- FROZEN/SEALED OBJECTS ---');

const frozen1 = Object.freeze({ x: 1, y: undefined });
const normal1 = { x: 1 };

testAll('Frozen vs normal object',
  frozen1,
  normal1,
  'Frozen object with undefined vs normal without');

// 15. Very large objects
console.log('\n--- PERFORMANCE STRESS TEST ---');

const bigObj1 = {};
const bigObj2 = {};
for (let i = 0; i < 10000; i++) {
  if (i % 100 === 0) {
    bigObj1[`key${i}`] = undefined;
    // bigObj2 missing these keys
  } else {
    bigObj1[`key${i}`] = i;
    bigObj2[`key${i}`] = i;
  }
}

console.log('\nLarge object test (10000 properties):');
console.log('  100 properties are undefined in obj1, missing in obj2');

const start1 = Date.now();
let result1;
try {
  result1 = fastDeepEqual(bigObj1, bigObj2);
} catch (e) {
  result1 = `Error: ${e.message}`;
}
const time1 = Date.now() - start1;

const start2 = Date.now();
let result2;
try {
  result2 = fastDeepEqualUndefined(bigObj1, bigObj2);
} catch (e) {
  result2 = `Error: ${e.message}`;
}
const time2 = Date.now() - start2;

const start3 = Date.now();
let result3;
try {
  result3 = fastDeepEqualUndefinedV2(bigObj1, bigObj2);
} catch (e) {
  result3 = `Error: ${e.message}`;
}
const time3 = Date.now() - start3;

console.log(`  Original: ${result1} (${time1}ms)`);
console.log(`  Modified v1: ${result2} (${time2}ms)`);
console.log(`  Modified v2: ${result3} (${time3}ms)`);

console.log('\n' + '='.repeat(60));
console.log('Additional edge case testing completed!');
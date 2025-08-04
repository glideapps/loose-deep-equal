const deepEqual = require('deep-equal');
const fastDeepEqual = require('fast-deep-equal');
const { isEqual } = require('lodash');

// Test cases
const testCases = [
  {
    name: 'Empty array vs empty object',
    a: [],
    b: {}
  },
  {
    name: 'Array [1] vs object {"0": 1}',
    a: [1],
    b: {"0": 1}
  },
  {
    name: 'Array [1, 2, 3] vs object {"0": 1, "1": 2, "2": 3}',
    a: [1, 2, 3],
    b: {"0": 1, "1": 2, "2": 3}
  },
  {
    name: 'Array with length property vs object with length',
    a: [1, 2, 3],
    b: {"0": 1, "1": 2, "2": 3, "length": 3}
  },
  {
    name: 'Sparse array vs object',
    a: (() => { const arr = []; arr[2] = 'value'; return arr; })(),
    b: {"2": "value"}
  },
  {
    name: 'Array with non-numeric property vs object',
    a: (() => { const arr = [1, 2]; arr.foo = 'bar'; return arr; })(),
    b: {"0": 1, "1": 2, "foo": "bar"}
  }
];

// Run tests
console.log('Edge Cases: Array vs Object Comparisons');
console.log('========================================\n');

testCases.forEach(test => {
  console.log(`Test: ${test.name}`);
  console.log(`Comparing: ${JSON.stringify(test.a)} vs ${JSON.stringify(test.b)}`);
  console.log('-'.repeat(60));
  
  try {
    const deepEqualResult = deepEqual(test.a, test.b, { strict: true });
    console.log(`deep-equal (strict): ${deepEqualResult}`);
  } catch (e) {
    console.log(`deep-equal (strict): Error - ${e.message}`);
  }
  
  try {
    const fastDeepEqualResult = fastDeepEqual(test.a, test.b);
    console.log(`fast-deep-equal:     ${fastDeepEqualResult}`);
  } catch (e) {
    console.log(`fast-deep-equal:     Error - ${e.message}`);
  }
  
  try {
    const lodashResult = isEqual(test.a, test.b);
    console.log(`lodash.isEqual:      ${lodashResult}`);
  } catch (e) {
    console.log(`lodash.isEqual:      Error - ${e.message}`);
  }
  
  console.log('\n');
});

// Additional test: Check type checking behavior
console.log('Additional Type Checking Tests');
console.log('==============================\n');

// Test with constructor property
const arrWithConstructor = [1, 2, 3];
const objWithConstructor = {
  "0": 1,
  "1": 2,
  "2": 3,
  "length": 3,
  "constructor": Array
};

console.log('Array vs Object with Array constructor:');
console.log(`Comparing: ${JSON.stringify(arrWithConstructor)} vs ${JSON.stringify(objWithConstructor)}`);
console.log('-'.repeat(60));
console.log(`deep-equal (strict): ${deepEqual(arrWithConstructor, objWithConstructor, { strict: true })}`);
console.log(`fast-deep-equal:     ${fastDeepEqual(arrWithConstructor, objWithConstructor)}`);
console.log(`lodash.isEqual:      ${isEqual(arrWithConstructor, objWithConstructor)}`);
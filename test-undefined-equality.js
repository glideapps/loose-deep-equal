const fastDeepEqual = require('fast-deep-equal');
const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');

console.log('Testing fast-deep-equal-undefined behavior');
console.log('==========================================\n');

const testCases = [
  {
    name: 'Missing property vs undefined',
    a: { x: 1 },
    b: { x: 1, y: undefined },
    description: 'Object without property y vs object with y: undefined'
  },
  {
    name: 'Undefined property in both',
    a: { x: 1, y: undefined },
    b: { x: 1, y: undefined },
    description: 'Both objects have y: undefined'
  },
  {
    name: 'Missing property in first object',
    a: { x: 1 },
    b: { x: 1, y: 2 },
    description: 'First object missing property y'
  },
  {
    name: 'Missing property in second object',
    a: { x: 1, y: 2 },
    b: { x: 1 },
    description: 'Second object missing property y'
  },
  {
    name: 'Complex nested case',
    a: { x: 1, nested: { a: 1 } },
    b: { x: 1, nested: { a: 1, b: undefined }, z: undefined },
    description: 'Nested objects with missing/undefined properties'
  },
  {
    name: 'Both missing same property',
    a: { x: 1 },
    b: { x: 1 },
    description: 'Both objects missing property y (should be equal)'
  },
  {
    name: 'Null vs undefined',
    a: { x: 1, y: null },
    b: { x: 1, y: undefined },
    description: 'Null is not the same as undefined'
  },
  {
    name: 'Null vs missing',
    a: { x: 1, y: null },
    b: { x: 1 },
    description: 'Null is not the same as missing'
  }
];

console.log('Comparing behavior of original vs modified version:\n');
console.log('Test Case                    | Original | Modified | Match?');
console.log('-----------------------------|----------|----------|-------');

testCases.forEach(test => {
  const originalResult = fastDeepEqual(test.a, test.b);
  const modifiedResult = fastDeepEqualUndefined(test.a, test.b);
  const match = originalResult === modifiedResult ? '✓' : '✗';
  
  console.log(
    `${test.name.padEnd(28)} | ${String(originalResult).padEnd(8)} | ${String(modifiedResult).padEnd(8)} | ${match}`
  );
});

console.log('\nDetailed test results:\n');

testCases.forEach(test => {
  console.log(`${test.name}:`);
  console.log(`  ${test.description}`);
  console.log(`  a: ${JSON.stringify(test.a)}`);
  console.log(`  b: ${JSON.stringify(test.b)}`);
  console.log(`  Original fast-deep-equal: ${fastDeepEqual(test.a, test.b)}`);
  console.log(`  Modified (undefined-aware): ${fastDeepEqualUndefined(test.a, test.b)}`);
  console.log('');
});
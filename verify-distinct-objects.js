const fs = require('fs');

console.log('Testing object identity...\n');

// Test 1: Simple case
const simpleJson = '{"a": 1, "b": [1, 2, 3]}';
const simple1 = JSON.parse(simpleJson);
const simple2 = JSON.parse(simpleJson);

console.log('Simple objects:');
console.log('simple1 === simple2:', simple1 === simple2); // Should be false
console.log('simple1.b === simple2.b:', simple1.b === simple2.b); // Should be false

// Test 2: Load the large file
console.log('\nLoading /tmp/app.json...');
const jsonContent = fs.readFileSync('/tmp/app.json', 'utf8');
const obj1 = JSON.parse(jsonContent);
const obj2 = JSON.parse(jsonContent);

console.log('\nLarge JSON objects:');
console.log('obj1 === obj2:', obj1 === obj2); // Should be false

// Check some nested properties (if they exist)
const firstKey = Object.keys(obj1)[0];
if (firstKey && typeof obj1[firstKey] === 'object') {
  console.log(`obj1["${firstKey}"] === obj2["${firstKey}"]:`, obj1[firstKey] === obj2[firstKey]); // Should be false
}

// Test 3: What happens if we use the same object?
const deepEqual = require('deep-equal');
const fastDeepEqual = require('fast-deep-equal');
const { isEqual } = require('lodash');

console.log('\nTiming comparison with SAME object reference:');
const start1 = process.hrtime.bigint();
const result1 = fastDeepEqual(obj1, obj1); // Same object
const time1 = Number(process.hrtime.bigint() - start1) / 1_000_000;
console.log(`fast-deep-equal (same object): ${time1.toFixed(2)}ms, result: ${result1}`);

console.log('\nTiming comparison with DIFFERENT object references:');
const start2 = process.hrtime.bigint();
const result2 = fastDeepEqual(obj1, obj2); // Different objects
const time2 = Number(process.hrtime.bigint() - start2) / 1_000_000;
console.log(`fast-deep-equal (different objects): ${time2.toFixed(2)}ms, result: ${result2}`);

console.log(`\nDifference: ${time2 > time1 ? 'Different objects took longer' : 'Same object took longer'} (${Math.abs(time2 - time1).toFixed(2)}ms difference)`);
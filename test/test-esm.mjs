// Test ESM imports
import looseEqualDefault from '../src/index.mjs';
import { looseEqual as looseEqualNamed } from '../src/index.mjs';

console.log('Testing ESM imports...\n');

// Test default import
console.log('Testing default import:');
const test1 = looseEqualDefault({ a: 1 }, { a: 1, b: undefined });
console.log('looseEqualDefault({ a: 1 }, { a: 1, b: undefined }):', test1);
console.log('Expected: true');
console.log(test1 === true ? '✓ PASS' : '✗ FAIL');

// Test named import
console.log('\nTesting named import:');
const test2 = looseEqualNamed({ x: 1 }, { x: 1, y: undefined });
console.log('looseEqualNamed({ x: 1 }, { x: 1, y: undefined }):', test2);
console.log('Expected: true');
console.log(test2 === true ? '✓ PASS' : '✗ FAIL');

// Verify they're the same function
console.log('\nVerifying exports are the same function:');
console.log('looseEqualDefault === looseEqualNamed:', looseEqualDefault === looseEqualNamed);

console.log('\nESM imports work correctly!');
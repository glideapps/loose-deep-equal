const deepEqual = require('deep-equal');
const fastDeepEqual = require('fast-deep-equal');
const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');
const { isEqual } = require('lodash');

// Test data sets - including cases with undefined
const testData = {
  // Objects with undefined properties
  undefined1: { a: 1, b: undefined, c: 3 },
  undefined2: { a: 1, c: 3 },
  undefined3: { a: 1, b: undefined, c: 3, d: undefined },
  
  // Simple objects
  simple1: { a: 1, b: 2, c: 3 },
  simple2: { a: 1, b: 2, c: 3 },
  
  // Nested with undefined
  nestedUndef1: {
    a: 1,
    b: { x: 10, y: undefined },
    c: { d: { e: { f: 100, g: undefined } } }
  },
  nestedUndef2: {
    a: 1,
    b: { x: 10 },
    c: { d: { e: { f: 100 } } }
  },
  
  // Large objects with some undefined
  largeUndef1: {},
  largeUndef2: {}
};

// Generate large objects with some undefined values
for (let i = 0; i < 1000; i++) {
  testData.largeUndef1[`key${i}`] = i % 10 === 0 ? undefined : { value: i, nested: { data: i * 2 } };
  testData.largeUndef2[`key${i}`] = i % 10 === 0 ? undefined : { value: i, nested: { data: i * 2 } };
}

// Benchmark function
function benchmark(name, fn, iterations = 100000) {
  const start = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1_000_000; // Convert to milliseconds
  const opsPerSec = (iterations / (duration / 1000)).toFixed(0);
  
  return {
    name,
    duration: duration.toFixed(2),
    opsPerSec,
    avgTime: (duration / iterations).toFixed(4)
  };
}

// Run benchmarks for each test case
function runBenchmarks(desc, obj1, obj2, iterations = 100000) {
  console.log(`\n${desc}`);
  console.log('='.repeat(60));
  
  const results = [
    benchmark('deep-equal (strict)', () => deepEqual(obj1, obj2, { strict: true }), iterations),
    benchmark('fast-deep-equal', () => fastDeepEqual(obj1, obj2), iterations),
    benchmark('fast-deep-equal-undef', () => fastDeepEqualUndefined(obj1, obj2), iterations),
    benchmark('lodash.isEqual', () => isEqual(obj1, obj2), iterations)
  ];
  
  // Sort by ops/sec
  results.sort((a, b) => Number(b.opsPerSec) - Number(a.opsPerSec));
  
  // Display results
  console.log('Library                | Total Time (ms) | Ops/sec     | Avg Time (ms)');
  console.log('-----------------------|-----------------|-------------|---------------');
  results.forEach(result => {
    console.log(
      `${result.name.padEnd(22)} | ${result.duration.padStart(15)} | ${result.opsPerSec.padStart(11)} | ${result.avgTime.padStart(13)}`
    );
  });
  
  // Show relative performance
  const fastest = results[0];
  console.log('\nRelative Performance:');
  results.forEach(result => {
    const relative = (Number(result.opsPerSec) / Number(fastest.opsPerSec) * 100).toFixed(1);
    console.log(`${result.name}: ${relative}%`);
  });
}

// Run all benchmarks
console.log('Deep Equality Benchmarks with Undefined-Aware Version');
console.log('====================================================\n');

const iterations = 10000;

// Test cases where modified version should return different results
console.log('SPECIAL CASE: Objects with missing vs undefined properties');
runBenchmarks('Undefined vs Missing Property', testData.undefined1, testData.undefined2, iterations);

// Regular test cases
runBenchmarks('Simple Objects (Equal)', testData.simple1, testData.simple2, iterations);

runBenchmarks('Nested with Undefined Properties', testData.nestedUndef1, testData.nestedUndef2, iterations);

runBenchmarks('Large Objects with Undefined', testData.largeUndef1, testData.largeUndef2, 100);

// Show behavior differences
console.log('\n\nBehavior Comparison:');
console.log('====================');
console.log('Comparing {a: 1, b: undefined} with {a: 1}:');
console.log(`  deep-equal: ${deepEqual(testData.undefined1, testData.undefined2, { strict: true })}`);
console.log(`  fast-deep-equal: ${fastDeepEqual(testData.undefined1, testData.undefined2)}`);
console.log(`  fast-deep-equal-undefined: ${fastDeepEqualUndefined(testData.undefined1, testData.undefined2)}`);
console.log(`  lodash.isEqual: ${isEqual(testData.undefined1, testData.undefined2)}`);

console.log('\n' + '='.repeat(60));
console.log('Benchmark completed!');
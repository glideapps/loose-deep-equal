const deepEqual = require('deep-equal');
const fastDeepEqual = require('fast-deep-equal');
const { isEqual } = require('lodash');

// Test data sets
const testData = {
  // Simple objects
  simple1: { a: 1, b: 2, c: 3 },
  simple2: { a: 1, b: 2, c: 3 },
  simple3: { a: 1, b: 2, c: 4 },

  // Nested objects
  nested1: {
    a: 1,
    b: { x: 10, y: 20 },
    c: { d: { e: { f: 100 } } }
  },
  nested2: {
    a: 1,
    b: { x: 10, y: 20 },
    c: { d: { e: { f: 100 } } }
  },
  nested3: {
    a: 1,
    b: { x: 10, y: 20 },
    c: { d: { e: { f: 200 } } }
  },

  // Arrays
  array1: [1, 2, 3, 4, 5],
  array2: [1, 2, 3, 4, 5],
  array3: [1, 2, 3, 4, 6],

  // Mixed arrays and objects
  mixed1: {
    users: [
      { id: 1, name: 'John', tags: ['admin', 'user'] },
      { id: 2, name: 'Jane', tags: ['user'] }
    ],
    settings: {
      theme: 'dark',
      notifications: { email: true, push: false }
    }
  },
  mixed2: {
    users: [
      { id: 1, name: 'John', tags: ['admin', 'user'] },
      { id: 2, name: 'Jane', tags: ['user'] }
    ],
    settings: {
      theme: 'dark',
      notifications: { email: true, push: false }
    }
  },
  mixed3: {
    users: [
      { id: 1, name: 'John', tags: ['admin', 'user'] },
      { id: 2, name: 'Jane', tags: ['moderator'] }
    ],
    settings: {
      theme: 'dark',
      notifications: { email: true, push: false }
    }
  },

  // Large objects
  large1: {},
  large2: {},
  large3: {}
};

// Generate large objects
for (let i = 0; i < 1000; i++) {
  testData.large1[`key${i}`] = { value: i, nested: { data: i * 2 } };
  testData.large2[`key${i}`] = { value: i, nested: { data: i * 2 } };
  testData.large3[`key${i}`] = { value: i, nested: { data: i === 500 ? i * 3 : i * 2 } };
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
    benchmark('lodash.isEqual', () => isEqual(obj1, obj2), iterations)
  ];
  
  // Sort by ops/sec
  results.sort((a, b) => Number(b.opsPerSec) - Number(a.opsPerSec));
  
  // Display results
  console.log('Library            | Total Time (ms) | Ops/sec     | Avg Time (ms)');
  console.log('-------------------|-----------------|-------------|---------------');
  results.forEach(result => {
    console.log(
      `${result.name.padEnd(18)} | ${result.duration.padStart(15)} | ${result.opsPerSec.padStart(11)} | ${result.avgTime.padStart(13)}`
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
console.log('Deep Equality Benchmarks');
console.log('========================\n');

// Use fewer iterations for deep-equal to avoid timeout
const iterations = 10000;

// Simple objects (equal)
runBenchmarks('Simple Objects (Equal)', testData.simple1, testData.simple2, iterations);

// Simple objects (not equal)
runBenchmarks('Simple Objects (Not Equal)', testData.simple1, testData.simple3, iterations);

// Nested objects (equal)
runBenchmarks('Nested Objects (Equal)', testData.nested1, testData.nested2, iterations);

// Nested objects (not equal)
runBenchmarks('Nested Objects (Not Equal)', testData.nested1, testData.nested3, iterations);

// Arrays (equal)
runBenchmarks('Arrays (Equal)', testData.array1, testData.array2, iterations);

// Arrays (not equal)
runBenchmarks('Arrays (Not Equal)', testData.array1, testData.array3, iterations);

// Mixed data (equal)
runBenchmarks('Mixed Arrays/Objects (Equal)', testData.mixed1, testData.mixed2, iterations);

// Mixed data (not equal)
runBenchmarks('Mixed Arrays/Objects (Not Equal)', testData.mixed1, testData.mixed3, iterations);

// Large objects (equal)
runBenchmarks('Large Objects (Equal)', testData.large1, testData.large2, 100);

// Large objects (not equal)
runBenchmarks('Large Objects (Not Equal)', testData.large1, testData.large3, 100);

console.log('\n' + '='.repeat(60));
console.log('Benchmark completed!');
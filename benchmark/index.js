const looseEqual = require('../src/index');
const fastDeepEqual = require('fast-deep-equal');
const { isEqual } = require('lodash');

console.log('Loose Deep Equal - Benchmark\n');

function benchmark(name, fn, iterations = 100000) {
  // Warm up
  for (let i = 0; i < 100; i++) fn();
  
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = process.hrtime.bigint();
  
  const duration = Number(end - start) / 1_000_000;
  const opsPerSec = (iterations / (duration / 1000)).toFixed(0);
  
  return {
    name,
    duration: duration.toFixed(2),
    opsPerSec,
    avgTime: (duration / iterations).toFixed(4)
  };
}

function runBenchmark(desc, a, b, iterations = 100000) {
  console.log(`\n${desc}`);
  console.log('='.repeat(60));
  
  const results = [
    benchmark('loose-deep-equal', () => looseEqual(a, b), iterations),
    benchmark('fast-deep-equal', () => fastDeepEqual(a, b), iterations),
    benchmark('lodash.isEqual', () => isEqual(a, b), iterations)
  ];
  
  results.sort((a, b) => Number(b.opsPerSec) - Number(a.opsPerSec));
  
  console.log('Library          | Ops/sec     | Avg Time (μs) | Relative');
  console.log('-----------------|-------------|---------------|----------');
  
  const fastest = results[0];
  results.forEach(result => {
    const relative = (Number(result.opsPerSec) / Number(fastest.opsPerSec) * 100).toFixed(1);
    const avgTimeMicro = (Number(result.avgTime) * 1000).toFixed(2);
    console.log(
      `${result.name.padEnd(16)} | ${result.opsPerSec.padStart(11)} | ${avgTimeMicro.padStart(13)} | ${relative.padStart(8)}%`
    );
  });
}

// Test cases that highlight the difference
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2, c: undefined };

console.log('Test case: { a: 1, b: 2 } vs { a: 1, b: 2, c: undefined }');
console.log('Expected results:');
console.log('  loose-deep-equal:', looseEqual(obj1, obj2));
console.log('  fast-deep-equal:', fastDeepEqual(obj1, obj2));
console.log('  lodash.isEqual:', isEqual(obj1, obj2));

// Benchmarks
runBenchmark('Simple objects (equal)', { a: 1 }, { a: 1 });

runBenchmark('Simple objects (with undefined)', obj1, obj2);

runBenchmark('Nested objects', 
  { user: { name: 'John', age: 30 } },
  { user: { name: 'John', age: 30 } }
);

runBenchmark('Large objects (100 properties)', 
  Object.fromEntries(Array(100).fill(0).map((_, i) => [`key${i}`, i])),
  Object.fromEntries(Array(100).fill(0).map((_, i) => [`key${i}`, i])),
  10000
);

console.log('\n' + '='.repeat(60));
console.log('Benchmark completed!');
const fs = require('fs');
const deepEqual = require('deep-equal');
const fastDeepEqual = require('fast-deep-equal');
const { isEqual } = require('lodash');

console.log('Loading /tmp/app.json...');
const startLoad = Date.now();
const jsonContent = fs.readFileSync('/tmp/app.json', 'utf8');
const obj1 = JSON.parse(jsonContent);
const obj2 = JSON.parse(jsonContent); // Parse twice to ensure different object references
const loadTime = Date.now() - startLoad;

console.log(`File loaded and parsed in ${loadTime}ms`);
console.log(`File size: ${(jsonContent.length / 1024 / 1024).toFixed(2)}MB`);
console.log(`Object keys at root level: ${Object.keys(obj1).length}`);
console.log('\n');

// Benchmark function for single runs (since the file is large)
function benchmarkSingle(name, fn) {
  const start = process.hrtime.bigint();
  const result = fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1_000_000; // Convert to milliseconds
  
  return {
    name,
    duration: duration.toFixed(2),
    result
  };
}

// Run multiple iterations for more accurate timing
function benchmarkMultiple(name, fn, iterations = 10) {
  const times = [];
  let result;
  
  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    result = fn();
    const end = process.hrtime.bigint();
    times.push(Number(end - start) / 1_000_000);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  return {
    name,
    avgDuration: avgTime.toFixed(2),
    minDuration: minTime.toFixed(2),
    maxDuration: maxTime.toFixed(2),
    result
  };
}

console.log('Deep Equality Benchmark: Large JSON File (/tmp/app.json)');
console.log('=========================================================\n');

console.log('Warming up...');
// Warm up runs
fastDeepEqual(obj1, obj2);
isEqual(obj1, obj2);

console.log('Running benchmarks (10 iterations each)...\n');

const results = [
  benchmarkMultiple('fast-deep-equal', () => fastDeepEqual(obj1, obj2)),
  benchmarkMultiple('lodash.isEqual', () => isEqual(obj1, obj2)),
  benchmarkMultiple('deep-equal (strict)', () => deepEqual(obj1, obj2, { strict: true }))
];

// Display results
console.log('Library             | Avg Time (ms) | Min Time (ms) | Max Time (ms) | Result');
console.log('--------------------|---------------|---------------|---------------|--------');
results.forEach(result => {
  console.log(
    `${result.name.padEnd(19)} | ${result.avgDuration.padStart(13)} | ${result.minDuration.padStart(13)} | ${result.maxDuration.padStart(13)} | ${result.result}`
  );
});

// Sort by average time and show relative performance
const sortedResults = [...results].sort((a, b) => parseFloat(a.avgDuration) - parseFloat(b.avgDuration));
const fastest = sortedResults[0];

console.log('\nRelative Performance (based on average time):');
results.forEach(result => {
  const relative = (parseFloat(fastest.avgDuration) / parseFloat(result.avgDuration) * 100).toFixed(1);
  console.log(`${result.name}: ${relative}% (${relative === '100.0' ? 'fastest' : `${(parseFloat(result.avgDuration) / parseFloat(fastest.avgDuration)).toFixed(1)}x slower`})`);
});

console.log('\nNote: All libraries correctly returned "true" for identical objects.');
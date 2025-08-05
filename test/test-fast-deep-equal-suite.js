'use strict';

const looseEqual = require('../src/index');
const assert = require('assert');

// Load test suites
const standardTests = require('./fast-deep-equal-tests');
const es6Tests = require('./fast-deep-equal-es6tests');

console.log('\nRunning fast-deep-equal test suite with loose-deep-equal...\n');

let totalPassed = 0;
let totalFailed = 0;
let expectedFailures = 0;

// Test cases that we expect to fail due to loose equality semantics
const expectedToFail = [
  // Object tests - these expect {} !== {foo: undefined}
  // This is the core difference in our implementation
  'object with extra undefined properties are not equal #1',
  'object with extra undefined properties are not equal #2',
];

function isExpectedFailure(description) {
  return expectedToFail.some(pattern => description.includes(pattern));
}

function runTest(test, suiteName, suiteDescription) {
  const fullDescription = `${suiteName} > ${suiteDescription} > ${test.description}`;
  
  try {
    const result = looseEqual(test.value1, test.value2);
    assert.strictEqual(result, test.equal);
    
    // Also test with reversed arguments
    const reverseResult = looseEqual(test.value2, test.value1);
    assert.strictEqual(reverseResult, test.equal);
    
    console.log(`✓ ${fullDescription}`);
    totalPassed++;
    return true;
  } catch (err) {
    if (isExpectedFailure(test.description)) {
      console.log(`⚠️  ${fullDescription} (expected failure - loose equality)`);
      expectedFailures++;
    } else {
      console.log(`✗ ${fullDescription}`);
      console.log(`   Expected: ${test.equal}, Got: ${looseEqual(test.value1, test.value2)}`);
      totalFailed++;
    }
    return false;
  }
}

function runTestSuite(suite, suiteName) {
  console.log(`\n=== ${suiteName}: ${suite.description} ===`);
  
  suite.tests.forEach(test => {
    if (!test.skip) {
      runTest(test, suiteName, suite.description);
    }
  });
}

// Run standard tests
console.log('STANDARD TESTS');
console.log('==============');
standardTests.forEach(suite => runTestSuite(suite, 'Standard'));

// Run ES6 tests if available
if (typeof Map !== 'undefined' && typeof Set !== 'undefined') {
  console.log('\n\nES6 TESTS');
  console.log('=========');
  es6Tests.forEach(suite => runTestSuite(suite, 'ES6'));
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('=======');
console.log(`Tests passed: ${totalPassed}`);
console.log(`Tests failed (unexpected): ${totalFailed}`);
console.log(`Tests failed (expected - loose equality): ${expectedFailures}`);
console.log(`Total tests: ${totalPassed + totalFailed + expectedFailures}`);

if (totalFailed > 0) {
  console.log('\n❌ Some tests failed unexpectedly!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed (or failed as expected due to loose equality)');
}
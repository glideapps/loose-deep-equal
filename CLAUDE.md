# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains `loose-deep-equal`, a fast deep equality comparison library that treats missing properties as equal to `undefined`. It's based on `fast-deep-equal` but modified to support loose equality semantics, making it ideal for comparing API responses, configuration objects, and other scenarios where undefined and missing properties should be considered equivalent.

## Common Commands

### Testing
```bash
# Run all tests (includes our tests + fast-deep-equal test suite)
npm test

# Run specific test files
node test/test.js                          # Our custom tests
node test/test-fast-deep-equal-suite.js    # fast-deep-equal test suite
node test/test-commonjs.js                 # CommonJS import test
node test/test-esm.mjs                     # ESM import test
```

### Benchmarking
```bash
# Run main benchmarks
npm run benchmark

# Run specific benchmarks
node benchmark-with-undefined.js     # Detailed undefined equality benchmarks
node benchmark-large-json.js         # Large JSON file test (requires /tmp/app.json)
node edge-cases.js                  # Edge case comparisons
```

### Development Testing
```bash
# Test specific edge cases
node test-undefined-equality.js      # Basic undefined equality tests
node test-malicious-objects.js       # Security tests
node test-comprehensive-edge-cases.js # All edge cases
node test-undefined-specific.js      # Undefined-specific behaviors
```

## Architecture

### Core Implementation (`index.js`)
The main implementation with key features:
- **Fast path**: When objects have same number of keys, uses original fast-deep-equal algorithm
- **Slow path**: When key counts differ, uses optimized double-loop to check all properties
- **ES6 Support**: Handles Maps, Sets, TypedArrays, and BigInt
- **Safety**: Uses `Object.prototype.hasOwnProperty.call()` to avoid prototype pollution

### Module Support
- `index.js` - CommonJS entry point
- `index.mjs` - ESM wrapper providing default and named exports
- `index.d.ts` - TypeScript definitions for both import styles

### Test Structure
- `test/test.js` - Core functionality tests
- `test/test-fast-deep-equal-suite.js` - Adapter for running fast-deep-equal's test suite
- `test/fast-deep-equal-tests.js` & `test/fast-deep-equal-es6tests.js` - Original test data from fast-deep-equal

### Key Implementation Details

1. **Loose Equality Logic**: The core difference is in object comparison - when objects have different numbers of keys, the implementation:
   - Iterates through all keys from object A, treating missing keys in B as undefined
   - Iterates through keys from B that aren't in A, comparing them against undefined
   - This avoids creating intermediate Sets while maintaining correctness

2. **Performance Optimizations**:
   - Early constructor check to avoid comparing different types
   - Special handling for null prototype objects
   - Native for-of loops for ES6 collections
   - Backward iteration for arrays (cache-friendly)

3. **Expected Test Failures**: Only 2 tests from fast-deep-equal's suite fail as expected:
   - `object with extra undefined properties are not equal #1`
   - `object with extra undefined properties are not equal #2`
   These failures are correct behavior for loose equality.

## Package Configuration

The package supports both CommonJS and ESM:
- `"main"`: CommonJS entry
- `"module"`: ESM entry
- `"exports"`: Conditional exports for Node.js
- `"sideEffects": false`: Enables tree-shaking
- `"engines"`: Requires Node.js >=16.0.0

## Performance Characteristics

Based on benchmarks:
- Simple equal objects: ~72% of fast-deep-equal speed
- Nested objects: ~85% of fast-deep-equal speed  
- Large objects (100+ properties): ~96% of fast-deep-equal speed
- Objects with undefined properties: ~33% speed (due to checking all keys)
- Still 3-6x faster than lodash.isEqual in all cases
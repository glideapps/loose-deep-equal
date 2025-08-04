# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a benchmarking project that compares the performance and correctness of three popular JavaScript deep equality libraries:
- `deep-equal` (v2.2.3)
- `fast-deep-equal` (v3.1.1)
- `lodash.isEqual`

## Common Commands

### Running Benchmarks

```bash
# Standard benchmark with various object types
node benchmark.js

# Benchmark with large JSON file (requires /tmp/app.json)
node benchmark-large-json.js

# Test edge cases (array vs object comparisons)
node edge-cases.js

# Verify that objects are distinct in benchmarks
node verify-distinct-objects.js
```

## Architecture and Key Files

### Benchmark Files
- `benchmark.js`: Main benchmark suite testing various data structures (simple objects, nested objects, arrays, mixed data, large objects)
- `benchmark-large-json.js`: Performance test for real-world large JSON files (expects `/tmp/app.json`)
- `edge-cases.js`: Tests correctness of array vs object comparisons across libraries
- `verify-distinct-objects.js`: Ensures benchmark objects are distinct references (not same object)

### Key Patterns
- All benchmarks use separate object instances created via `JSON.parse()` to ensure fair comparison
- Performance is measured using `process.hrtime.bigint()` for high-precision timing
- Results include operations per second, average time, and relative performance comparisons

## Important Findings
Based on `benchmark-summary.md`:
- `fast-deep-equal` is 10-1000x faster than alternatives
- `deep-equal` v2.2.3 has severe performance issues with large objects
- All libraries correctly handle most edge cases except `deep-equal` v1.1.1 which incorrectly treats arrays and objects as equal
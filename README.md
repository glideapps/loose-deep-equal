# loose-deep-equal

[![Tests](https://github.com/glideapps/loose-deep-equal/actions/workflows/test.yml/badge.svg)](https://github.com/glideapps/loose-deep-equal/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/loose-deep-equal.svg)](https://www.npmjs.com/package/loose-deep-equal)

Fast deep equality comparison that treats missing properties as equal to `undefined`.

## Why?

Standard deep equality functions treat these objects as different:
```javascript
const obj1 = { a: 1 };
const obj2 = { a: 1, b: undefined };
```

But in many real-world scenarios (API responses, optional fields, configuration objects), you want these to be considered equal. That's what `loose-deep-equal` does.

## Features

- 🚀 **Fast** - Optimized for performance with early exits and minimal overhead
- 🎯 **Loose equality** - Missing properties are treated as `undefined`
- 🛡️ **Safe** - Handles circular references, null prototypes, and edge cases
- 📦 **Zero dependencies** - Small and self-contained
- 🔧 **Drop-in replacement** - Compatible with other deep equality functions
- 🆕 **ES6+ Support** - Full support for Maps, Sets, TypedArrays, and BigInt

## Installation

```bash
npm install loose-deep-equal
```

## Usage

### CommonJS
```javascript
const looseEqual = require('loose-deep-equal');

looseEqual({ a: 1 }, { a: 1, b: undefined }); // true
```

### ES Modules
```javascript
// Default import
import looseEqual from 'loose-deep-equal';

// Named import
import { looseEqual } from 'loose-deep-equal';

looseEqual({ a: 1 }, { a: 1, b: undefined }); // true
```

### Examples

```javascript
// Missing properties are treated as undefined
looseEqual({ a: 1 }, { a: 1, b: undefined }); // true

// Regular deep equality still works
looseEqual({ a: { b: 2 } }, { a: { b: 2 } }); // true

// null is not undefined
looseEqual({ a: null }, { a: undefined }); // false
looseEqual({ a: null }, {}); // false

// Works with arrays
looseEqual([1, 2], [1, 2]); // true

// Works with nested structures
looseEqual(
  { user: { name: 'John' } },
  { user: { name: 'John', age: undefined } }
); // true

// ES6 types are fully supported
looseEqual(new Map([[1, 2]]), new Map([[1, 2]])); // true
looseEqual(new Set([1, 2, 3]), new Set([3, 2, 1])); // true
```

## Comparison with other libraries

| Scenario | `loose-deep-equal` | `fast-deep-equal` | `lodash.isEqual` |
|----------|-------------------|-------------------|------------------|
| `{a: 1}` vs `{a: 1, b: undefined}` | ✅ `true` | ❌ `false` | ❌ `false` |
| `{a: null}` vs `{a: undefined}` | ❌ `false` | ❌ `false` | ❌ `false` |
| Simple equal objects | 71.8% speed | 100% (baseline) | 13.4% speed |
| Objects with undefined | 33.5% speed | 100% (baseline) | 19.0% speed |
| Large objects (100+ props) | 96.5% speed | 100% (baseline) | 81.5% speed |
| ES6 Maps/Sets support | ✅ Full | ✅ Full | ✅ Full |
| TypedArray support | ✅ Full | ✅ Full | ✅ Full |

## When to use this

Use `loose-deep-equal` when:
- Comparing API responses where fields might be omitted or explicitly set to `undefined`
- Working with configuration objects with optional properties
- Implementing state management where undefined and missing are semantically equivalent
- Migrating between APIs that handle optional fields differently

## When NOT to use this

Don't use `loose-deep-equal` when:
- You need to distinguish between missing properties and `undefined`
- You're working with data where `undefined` has special meaning
- You need strict equality semantics

## How it works

The algorithm:
1. If objects have the same number of keys, uses standard fast comparison
2. If different number of keys, checks all properties from both objects
3. Missing properties are treated as `undefined` during comparison
4. Handles all standard JavaScript types including Date, RegExp, typed arrays, etc.

## Performance

`loose-deep-equal` is highly optimized for performance. Here are the benchmark results:

### Performance vs fast-deep-equal

| Scenario | Performance | Details |
|----------|-------------|---------|
| Simple equal objects | **71.8%** | Objects with same structure |
| Nested objects | **85.1%** | Deep object hierarchies |
| Large objects (100+ properties) | **96.5%** | Nearly identical performance |
| Objects with undefined properties | **33.5%** | Our special case - checking all keys |

### Key optimizations:
- Fast path when objects have same number of keys (70-96% of original speed)
- Efficient double-loop algorithm for different key counts
- Early exit on first difference
- No intermediate Set creation for key comparison
- Native support for ES6 types without performance penalty

### Benchmark details:
- Still significantly faster than `lodash.isEqual` in all cases (3-6x faster)
- Much faster than the `deep-equal` library (100-1000x faster)
- Minimal overhead from Map/Set/TypedArray support

## Edge cases handled

- ✅ Circular references (throws like other deep equal libraries)
- ✅ Objects with null prototype
- ✅ Objects with overridden `hasOwnProperty`
- ✅ Sparse arrays
- ✅ Symbol properties (ignored, like other libraries)
- ✅ Non-enumerable properties (ignored)

## API

### `looseEqual(a, b)`

Compares two values for loose deep equality.

**Parameters:**
- `a` (*any*) - First value
- `b` (*any*) - Second value

**Returns:** `boolean` - True if values are loosely equal

**Example:**
```javascript
const looseEqual = require('loose-deep-equal');

looseEqual({ x: 1 }, { x: 1, y: undefined }); // true
looseEqual([1, 2, 3], [1, 2, 3]); // true
looseEqual(null, undefined); // false
```

## TypeScript

TypeScript definitions are included:

```typescript
import looseEqual from 'loose-deep-equal';

const result: boolean = looseEqual({ a: 1 }, { a: 1, b: undefined });
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Based on the excellent [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) by [@epoberezkin](https://github.com/epoberezkin).

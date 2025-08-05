/**
 * Performs a deep equality comparison between two values.
 * Missing properties are treated as equal to undefined.
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if the values are loosely equal, false otherwise
 * 
 * @example
 * ```typescript
 * // CommonJS
 * const looseEqual = require('loose-deep-equal');
 * 
 * // ESM - default import
 * import looseEqual from 'loose-deep-equal';
 * 
 * // ESM - named import
 * import { looseEqual } from 'loose-deep-equal';
 * 
 * looseEqual({ a: 1 }, { a: 1, b: undefined }); // true
 * looseEqual({ a: null }, { a: undefined }); // false
 * ```
 */
declare function looseEqual(a: any, b: any): boolean;

// For CommonJS default export
export = looseEqual;

// For ESM named export
export { looseEqual };
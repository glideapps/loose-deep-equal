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
 * import looseEqual from 'loose-deep-equal';
 * 
 * looseEqual({ a: 1 }, { a: 1, b: undefined }); // true
 * looseEqual({ a: null }, { a: undefined }); // false
 * ```
 */
declare function looseEqual(a: any, b: any): boolean;

export = looseEqual;
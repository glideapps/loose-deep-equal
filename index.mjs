/**
 * loose-deep-equal ESM wrapper
 * 
 * Fast deep equality comparison that treats missing properties as equal to undefined.
 * Based on fast-deep-equal with modifications for loose equality semantics.
 */

import looseEqual from './index.js';

export default looseEqual;

// Also export as named export for convenience
export { looseEqual };
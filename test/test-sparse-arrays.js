const looseEqual = require('../src/index');

console.log('Testing sparse arrays\n');

// Test 1: Sparse array vs dense array with undefined
const sparse = [1, , 3];  // sparse array with hole at index 1
const dense = [1, undefined, 3];  // dense array with undefined

console.log('Test 1: Sparse array vs dense array with undefined');
console.log('sparse:', sparse);
console.log('dense:', dense);
console.log('sparse.length:', sparse.length);
console.log('dense.length:', dense.length);
console.log('1 in sparse:', 1 in sparse);
console.log('1 in dense:', 1 in dense);
console.log('looseEqual(sparse, dense):', looseEqual(sparse, dense));
console.log();

// Test 2: Two identical sparse arrays
const sparse1 = [1, , , 4];
const sparse2 = [1, , , 4];

console.log('Test 2: Two identical sparse arrays');
console.log('sparse1:', sparse1);
console.log('sparse2:', sparse2);
console.log('looseEqual(sparse1, sparse2):', looseEqual(sparse1, sparse2));
console.log();

// Test 3: Sparse array vs object with missing properties
const sparseArr = [1, , 3];
const obj = { 0: 1, 2: 3, length: 3 };

console.log('Test 3: Sparse array vs object with array-like properties');
console.log('sparseArr:', sparseArr);
console.log('obj:', obj);
console.log('looseEqual(sparseArr, obj):', looseEqual(sparseArr, obj));
console.log();

// Test 4: Complex sparse arrays
const complexSparse1 = [{ a: 1 }, , [1, 2], , 5];
const complexSparse2 = [{ a: 1 }, undefined, [1, 2], undefined, 5];

console.log('Test 4: Complex sparse arrays');
console.log('complexSparse1:', complexSparse1);
console.log('complexSparse2:', complexSparse2);
console.log('looseEqual(complexSparse1, complexSparse2):', looseEqual(complexSparse1, complexSparse2));
console.log();

// Test 5: Empty sparse array
const emptySparse = new Array(5);  // [, , , , ]
const emptyDense = [undefined, undefined, undefined, undefined, undefined];

console.log('Test 5: Empty sparse array vs dense array with undefined');
console.log('emptySparse:', emptySparse);
console.log('emptyDense:', emptyDense);
console.log('emptySparse.length:', emptySparse.length);
console.log('emptyDense.length:', emptyDense.length);
console.log('looseEqual(emptySparse, emptyDense):', looseEqual(emptySparse, emptyDense));

// Add as test cases to main test file
console.log('\n// Test cases to add to test.js:');
console.log('t.ok(looseEqual([1, , 3], [1, undefined, 3]), "sparse array equals dense array with undefined");');
console.log('t.ok(looseEqual([1, , , 4], [1, , , 4]), "identical sparse arrays are equal");');
console.log('t.ok(looseEqual(new Array(5), [undefined, undefined, undefined, undefined, undefined]), "empty sparse array equals dense undefined array");');
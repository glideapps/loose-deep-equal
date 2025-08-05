const looseEqual = require('../src/index');

console.log('Testing arrays with extra properties\n');

// Test 1: Array with extra property vs regular array
const arrWithProp = [1, 2, 3];
arrWithProp.customProp = 'extra';
const regularArr = [1, 2, 3];

console.log('Test 1: Array with extra property vs regular array');
console.log('arrWithProp:', arrWithProp);
console.log('arrWithProp.customProp:', arrWithProp.customProp);
console.log('regularArr:', regularArr);
console.log('looseEqual(arrWithProp, regularArr):', looseEqual(arrWithProp, regularArr));
console.log();

// Test 2: Two arrays with same extra properties
const arr1 = [1, 2, 3];
arr1.customProp = 'same';
const arr2 = [1, 2, 3];
arr2.customProp = 'same';

console.log('Test 2: Two arrays with same extra properties');
console.log('arr1:', arr1);
console.log('arr1.customProp:', arr1.customProp);
console.log('arr2:', arr2);
console.log('arr2.customProp:', arr2.customProp);
console.log('looseEqual(arr1, arr2):', looseEqual(arr1, arr2));
console.log();

// Test 3: Arrays with different extra properties
const arr3 = [1, 2, 3];
arr3.customProp = 'value1';
const arr4 = [1, 2, 3];
arr4.customProp = 'value2';

console.log('Test 3: Arrays with different extra properties');
console.log('arr3.customProp:', arr3.customProp);
console.log('arr4.customProp:', arr4.customProp);
console.log('looseEqual(arr3, arr4):', looseEqual(arr3, arr4));
console.log();

// Test 4: Array with undefined extra property vs array without
const arr5 = [1, 2, 3];
arr5.customProp = undefined;
const arr6 = [1, 2, 3];

console.log('Test 4: Array with undefined extra property vs array without');
console.log('arr5:', arr5);
console.log('arr5.customProp:', arr5.customProp);
console.log('"customProp" in arr5:', 'customProp' in arr5);
console.log('arr6:', arr6);
console.log('"customProp" in arr6:', 'customProp' in arr6);
console.log('looseEqual(arr5, arr6):', looseEqual(arr5, arr6));
console.log();

// Test 5: Complex array with multiple properties
const complexArr1 = [1, { a: 2 }, [3, 4]];
complexArr1.meta = { type: 'data' };
complexArr1.count = 3;
const complexArr2 = [1, { a: 2 }, [3, 4]];

console.log('Test 5: Complex array with multiple properties vs regular array');
console.log('complexArr1:', complexArr1);
console.log('complexArr1.meta:', complexArr1.meta);
console.log('complexArr1.count:', complexArr1.count);
console.log('complexArr2:', complexArr2);
console.log('looseEqual(complexArr1, complexArr2):', looseEqual(complexArr1, complexArr2));

// Show what properties are enumerable on arrays
console.log('\nChecking enumerable properties:');
const testArr = [1, 2, 3];
testArr.customProp = 'test';
console.log('Object.keys(testArr):', Object.keys(testArr));
console.log('for...in loop results:');
for (let key in testArr) {
  console.log(`  ${key}: ${testArr[key]}`);
}
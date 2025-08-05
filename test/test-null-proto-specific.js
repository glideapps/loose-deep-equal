const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');

console.log('Testing null prototype objects specifically\n');

// Test 1: Basic null prototype comparison
const obj1 = Object.create(null);
obj1.x = 1;
obj1.y = undefined;

const obj2 = Object.create(null);
obj2.x = 1;

console.log('Test 1: Basic null prototype objects');
console.log('obj1:', obj1, '(has x=1, y=undefined)');
console.log('obj2:', obj2, '(has x=1)');

try {
  const result = fastDeepEqualUndefined(obj1, obj2);
  console.log('Result:', result, '(expected: true)');
  console.log('✓ Success!\n');
} catch (e) {
  console.log('✗ Error:', e.message, '\n');
}

// Test 2: Null prototype vs normal object
const obj3 = { x: 1 };

console.log('Test 2: Null prototype vs normal object');
console.log('obj2:', obj2, '(null prototype)');
console.log('obj3:', obj3, '(normal object)');

try {
  const result = fastDeepEqualUndefined(obj2, obj3);
  console.log('Result:', result);
  console.log('Note: They have different constructors\n');
} catch (e) {
  console.log('✗ Error:', e.message, '\n');
}

// Test 3: Null prototype with valueOf
const obj4 = Object.create(null);
obj4.x = 1;
obj4.valueOf = function() { return 42; };

const obj5 = Object.create(null);
obj5.x = 1;
obj5.valueOf = function() { return 42; };

console.log('Test 3: Null prototype objects with custom valueOf');
try {
  const result = fastDeepEqualUndefined(obj4, obj5);
  console.log('Result:', result, '(expected: true)');
  console.log('✓ Success!');
} catch (e) {
  console.log('✗ Error:', e.message);
}
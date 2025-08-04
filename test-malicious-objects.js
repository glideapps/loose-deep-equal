const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');

console.log('Testing with objects that override hasOwnProperty');
console.log('=================================================\n');

// Create malicious objects that override hasOwnProperty
const malicious1 = {
  x: 1,
  hasOwnProperty: "you dumbass"
};

const malicious2 = {
  x: 1,
  y: undefined,
  hasOwnProperty: "you dumbass"
};

const malicious3 = {
  x: 1,
  hasOwnProperty: function() { throw new Error("BOOM!"); }
};

const normal = {
  x: 1,
  y: undefined
};

// Test cases
console.log('Test 1: Malicious object with string hasOwnProperty');
console.log(`malicious1: ${JSON.stringify(malicious1)}`);
console.log(`malicious2: ${JSON.stringify(malicious2)}`);
try {
  const result = fastDeepEqualUndefined(malicious1, malicious2);
  console.log(`Result: ${result} (should be true)`);
} catch (e) {
  console.log(`ERROR: ${e.message}`);
}

console.log('\nTest 2: Malicious object with throwing hasOwnProperty');
console.log(`malicious3: ${JSON.stringify(malicious3)}`);
console.log(`normal: ${JSON.stringify(normal)}`);
try {
  const result = fastDeepEqualUndefined(malicious3, normal);
  console.log(`Result: ${result} (should be true)`);
} catch (e) {
  console.log(`ERROR: ${e.message}`);
}

console.log('\nTest 3: Both objects have malicious hasOwnProperty');
try {
  const result = fastDeepEqualUndefined(malicious1, malicious3);
  console.log(`Result: ${result} (should be false - different hasOwnProperty values)`);
} catch (e) {
  console.log(`ERROR: ${e.message}`);
}

console.log('\nTest 4: Verify hasOwnProperty is compared as a regular property');
const obj1 = { x: 1, hasOwnProperty: "a" };
const obj2 = { x: 1, hasOwnProperty: "b" };
const obj3 = { x: 1, hasOwnProperty: "a" };
console.log(`obj1 vs obj2: ${fastDeepEqualUndefined(obj1, obj2)} (should be false)`);
console.log(`obj1 vs obj3: ${fastDeepEqualUndefined(obj1, obj3)} (should be true)`);
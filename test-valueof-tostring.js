const fastDeepEqual = require('fast-deep-equal');
const fastDeepEqualUndefined = require('./fast-deep-equal-undefined');

console.log('Why valueOf and toString matter for equality\n');

// 1. Date objects
console.log('--- DATE OBJECTS ---');
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-01-01');
const date3 = new Date('2024-01-02');

console.log('date1:', date1);
console.log('date2:', date2);
console.log('date3:', date3);
console.log('date1 === date2:', date1 === date2, '(different objects)');
console.log('date1.valueOf() === date2.valueOf():', date1.valueOf() === date2.valueOf(), '(same timestamp)');
console.log('Using fast-deep-equal:');
console.log('  date1 vs date2:', fastDeepEqual(date1, date2), '(should be true - same time)');
console.log('  date1 vs date3:', fastDeepEqual(date1, date3), '(should be false - different time)');

// 2. What happens without valueOf check?
console.log('\n--- WITHOUT valueOf CHECK ---');
function naiveEqual(a, b) {
  if (a === b) return true;
  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    for (let key of keys) {
      if (!naiveEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return a!==a && b!==b;
}

console.log('Naive equality (no valueOf):');
console.log('  date1 vs date2:', naiveEqual(date1, date2), '(WRONG! Should be true)');

// 3. Custom valueOf examples
console.log('\n--- CUSTOM valueOf ---');
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  
  valueOf() {
    // Convert to cents for comparison
    return this.amount * 100;
  }
}

const price1 = new Money(19.99, 'USD');
const price2 = new Money(19.99, 'EUR');

console.log('price1:', price1);
console.log('price2:', price2);
console.log('price1.valueOf():', price1.valueOf());
console.log('price2.valueOf():', price2.valueOf());
console.log('fast-deep-equal:', fastDeepEqual(price1, price2), '(true because valueOf returns same)');

// 4. RegExp uses source and flags, not valueOf
console.log('\n--- REGEXP (SPECIAL CASE) ---');
const regex1 = /test/gi;
const regex2 = /test/gi;
const regex3 = /test/g;

console.log('regex1:', regex1);
console.log('regex2:', regex2);
console.log('regex3:', regex3);
console.log('regex1 === regex2:', regex1 === regex2);
console.log('fast-deep-equal regex1 vs regex2:', fastDeepEqual(regex1, regex2), '(same pattern & flags)');
console.log('fast-deep-equal regex1 vs regex3:', fastDeepEqual(regex1, regex3), '(different flags)');

// 5. What about toString?
console.log('\n--- CUSTOM toString ---');
class Version {
  constructor(major, minor, patch) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }
  
  toString() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
}

const v1 = new Version(1, 2, 3);
const v2 = new Version(1, 2, 3);

console.log('v1:', v1);
console.log('v2:', v2);
console.log('v1.toString():', v1.toString());
console.log('v2.toString():', v2.toString());
console.log('fast-deep-equal:', fastDeepEqual(v1, v2), '(true because toString returns same)');

// 6. Why check if it's the default method?
console.log('\n--- WHY CHECK FOR DEFAULT METHOD? ---');
const plainObj1 = { x: 1, y: 2 };
const plainObj2 = { x: 1, y: 2 };

console.log('Plain objects should compare properties, not use toString:');
console.log('plainObj1.toString():', plainObj1.toString());
console.log('plainObj2.toString():', plainObj2.toString());
console.log('Both toString() to "[object Object]" but have same properties');
console.log('fast-deep-equal:', fastDeepEqual(plainObj1, plainObj2), '(true - compares properties)');

const plainObj3 = { a: 1 };
console.log('\nplainObj3.toString():', plainObj3.toString(), '(also "[object Object]")');
console.log('fast-deep-equal plainObj1 vs plainObj3:', fastDeepEqual(plainObj1, plainObj3), '(false - different properties)');

console.log('\nThe check "valueOf !== Object.prototype.valueOf" ensures we only use');
console.log('valueOf when it\'s been overridden, not for regular objects.');
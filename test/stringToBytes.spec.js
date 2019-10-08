const assert = require('assert');
const stringToBytes = require('../src/modules/stringToBytes');

describe('Test constructor', () => {
  it('Expect a function', () => { assert.strictEqual(typeof stringToBytes, 'function'); });

  it('Should return null if input is invalid', () => {
    assert.strictEqual(stringToBytes(undefined), null);
    assert.strictEqual(stringToBytes(null), null);
    assert.strictEqual(stringToBytes(true), null);
    assert.strictEqual(stringToBytes(false), null);
    assert.strictEqual(stringToBytes(NaN), null);
    assert.strictEqual(stringToBytes(() => {}), null);
    assert.strictEqual(stringToBytes({}), null);
  });

  // This function is tested more accurately in another test suite
  it('Should be able to parse a string into a number', () => { assert.strictEqual(stringToBytes('1KB'), 1024); });

  // This function is tested more accurately in another test suite
  it('Should convert a number into a string', () => { assert.strictEqual(stringToBytes(1024), '1KB'); });

  // This function is tested more accurately in another test suite
  it('Should convert a number into a string with options', () => {
    assert.strictEqual(stringToBytes(1000, {thousandsSeparator: ' '}), '1 000B');
  });
});

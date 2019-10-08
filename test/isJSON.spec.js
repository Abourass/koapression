const assert = require('assert');
const isJSON = require('../src/modules/isJSON');

describe('isJSON test', () => {
  it('Expect a function', () => { assert.strictEqual(typeof isJSON, 'function'); });

  it('Should return null if input is invalid', () => {
    assert.strictEqual(isJSON({"hello": true}), true);
    assert.strictEqual(isJSON(null), false);
    assert.strictEqual(isJSON(true), false);
    assert.strictEqual(isJSON(false), false);
    assert.strictEqual(isJSON(NaN), false);
    assert.strictEqual(isJSON(() => {}), true);
    assert.strictEqual(isJSON({}), true);
  });
});

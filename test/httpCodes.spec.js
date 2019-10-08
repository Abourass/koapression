const assert = require('assert');
const http = require('http');

const status = require('../src/modules/httpCodes');

describe('status', () => {
  describe('arguments', () => {
    describe('code', () => {
      it('should be required', () => { assert.throws(status, /code must be/); });
      it('should accept a number', () => { assert.strictEqual(status(200), 200); });
      it('should accept a string', () => { assert.strictEqual(status('OK'), 200); });
      it('should accept a string number', () => { assert.strictEqual(status('200'), 200); });
      it('should reject an object', () => { assert.throws(status.bind(null, {}), /code must be/); });
    });
  });

  describe('when given a number', () => {
    it('should be truthy when a valid status code', () => {
      assert.ok(status(200));
      assert.ok(status(404));
      assert.ok(status(500));
    });

    it('should throw for invalid status code', () => {
      assert.throws(status.bind(null, 0), /invalid status code/);
      assert.throws(status.bind(null, 1000), /invalid status code/);
    });

    it('should throw for unknown status code', () => {
      assert.throws(status.bind(null, 299), /invalid status code/);
      assert.throws(status.bind(null, 310), /invalid status code/);
    });
  });

  describe('when given a string', () => {
    it('should be truthy when a valid status code', () => {
      assert.ok(status('200'));
      assert.ok(status('404'));
      assert.ok(status('500'));
    });

    it('should be truthy when a valid status message', () => {
      assert.ok(status('OK'));
      assert.ok(status('Not Found'));
      assert.ok(status('Internal Server Error'));
    });

    it('should be case insensitive', () => {
      assert.ok(status('Ok'));
      assert.ok(status('not found'));
      assert.ok(status('INTERNAL SERVER ERROR'));
    });

    it('should throw for unknown status message', () => {
      assert.throws(status.bind(null, 'too many bugs'), /invalid status message/);
    });

    it('should throw for unknown status code', () => {
      assert.throws(status.bind(null, '299'), /invalid status code/);
    });
  });

  describe('.STATUS_CODES', () => {
    it('should be a map of code to message', () => {
      assert.strictEqual(status.STATUS_CODES[200], 'OK');
    });

    it('should include codes from Node.js', () => {
      Object.keys(http.STATUS_CODES).forEach((code) => {
        assert.ok(status.STATUS_CODES[code], `contains ${code}`);
      });
    });
  });

  describe('.codes', () => {
    it('should include codes from Node.js', () => {
      Object.keys(http.STATUS_CODES).forEach((code) => {
        assert.notStrictEqual(status.codes.indexOf(Number(code)), -1, `contains ${code}`);
      });
    });
  });

  describe('.empty', () => {
    it('should be an object', () => {
      assert.ok(status.empty);
      assert.strictEqual(typeof status.empty, 'object');
    });

    it('should include 204', () => {
      assert(status.empty[204]);
    });
  });

  describe('.redirect', () => {
    it('should be an object', () => {
      assert.ok(status.redirect);
      assert.strictEqual(typeof status.redirect, 'object');
    });

    it('should include 308', () => {
      assert(status.redirect[308]);
    });
  });

  describe('.retry', () => {
    it('should be an object', () => {
      assert.ok(status.retry);
      assert.strictEqual(typeof status.retry, 'object');
    });

    it('should include 504', () => { assert(status.retry[504]); });
  });
});

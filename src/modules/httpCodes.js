const httpCodes = require('../database/httpCodes');

const populateStatusesMap = (statuses, codes) => {
  const arr = [];

  Object.keys(codes).forEach((code) => {
    const message = codes[code];
    const status = Number(code);

    // Populate properties
    statuses[status] = message;
    statuses[message] = status;
    statuses[message.toLowerCase()] = status;
    arr.push(status); // Add to array
  });
  return arr;
};

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code if valid, otherwise will lookup the code assuming this is the status message.
 * @param {string|number} code
 * @returns {number}
 * @public
 */
const status = (code) => {
  if (typeof code === 'number') { if (!status[code]) throw new Error(`invalid status code: ${code}`); return code; }
  if (typeof code !== 'string') { throw new TypeError('code must be a number or string'); }

  let codeNumber = parseInt(code, 10); // '403'
  if (!Number.isNaN(codeNumber)) {
    if (!status[codeNumber]) throw new Error(`invalid status code: ${codeNumber}`);
    return codeNumber;
  }
  codeNumber = status[code.toLowerCase()];
  if (!codeNumber) throw new Error(`invalid status message: "${code}"`);
  return codeNumber;
};

status.STATUS_CODES = httpCodes; // status code to message map
status.codes = populateStatusesMap(status, httpCodes); // array of status codes

status.redirect = { // status codes for redirects
  300: true,
  301: true,
  302: true,
  303: true,
  305: true,
  307: true,
  308: true,
};

// status codes for empty bodies
status.empty = {
  204: true,
  205: true,
  304: true,
};

// status codes for when you should retry the request
status.retry = {
  502: true,
  503: true,
  504: true,
};
module.exports = status;

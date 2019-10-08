const formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;
const formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;
const map = { b: 1, kb: 1 << 10, mb: 1 << 20, gb: 1 << 30, tb: Math.pow(1024, 4), pb: Math.pow(1024, 5) };

const parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;

/**
 * Parse the string value into an integer in bytes.
 * If no unit is given, it is assumed the value is in bytes.
 * @param {number|string} val
 * @returns {number|null}
 * @public
 */
function parse(val) {
  if (typeof val === 'number' && !Number.isNaN(val)) { return val; }
  if (typeof val !== 'string') { return null; }
  const results = parseRegExp.exec(val); // Test if the string passed is valid
  let floatValue, unit = 'b';
  if (!results) { // Nothing could be extracted from the given string
    floatValue = parseInt(val, 10);
    unit = 'b';
  } else { // Retrieve the value and the unit
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }
  return Math.floor(map[unit] * floatValue);
}

/**
 * Format the given value in bytes into a string.
 * If the value is negative, it is kept as such. If it is a float, it is rounded.
 * @param {number} value
 * @param {object} [options]
 * @param {number} [options.decimalPlaces=2]
 * @param {number} [options.fixedDecimals=false]
 * @param {string} [options.thousandsSeparator=]
 * @param {string} [options.unit=]
 * @param {string} [options.unitSeparator=]
 * @returns {string|null}
 * @public
 */
function format(value, options) {
  if (!Number.isFinite(value)) { return null; }
  const mag = Math.abs(value);
  const thousandsSeparator = (options && options.thousandsSeparator) || '';
  const unitSeparator = (options && options.unitSeparator) || '';
  const decimalPlaces = (options && options.decimalPlaces !== undefined) ? options.decimalPlaces : 2;
  const fixedDecimals = Boolean(options && options.fixedDecimals);
  let unit = (options && options.unit) || '';

  if (!unit || !map[unit.toLowerCase()]) {
    if (mag >= map.pb) { unit = 'PB'; } else if (mag >= map.tb) { unit = 'TB'; } else if (mag >= map.gb) { unit = 'GB'; } else if (mag >= map.mb) { unit = 'MB'; } else if (mag >= map.kb) { unit = 'KB'; } else { unit = 'B'; }
  }
  const val = value / map[unit.toLowerCase()];
  let str = val.toFixed(decimalPlaces);
  if (!fixedDecimals) { str = str.replace(formatDecimalsRegExp, '$1'); }
  if (thousandsSeparator) { str = str.replace(formatThousandsRegExp, thousandsSeparator); }
  return str + unitSeparator + unit;
}

/**
 * Convert the given value in bytes into a string or parse to string to an integer in bytes.
 * @param {string|number} value
 * @param {{
 *  case: [string],
 *  decimalPlaces: [number]
 *  fixedDecimals: [boolean]
 *  thousandsSeparator: [string]
 *  unitSeparator: [string]
 *  }} [options] bytes options.
 * @returns {string|number|null}
 */
const stringToBytes = (value, options) => {
  if (typeof value === 'string') { return parse(value); }
  if (typeof value === 'number') { return format(value, options); }
  return null; };

module.exports = stringToBytes;
module.exports.format = format;
module.exports.parse = parse;

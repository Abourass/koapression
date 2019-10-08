const fs = require('fs');

const compressibleTypeRegExp = /^text\/|\+(?:json|text|xml)$/i;
const extractTypeRegExp = /^\s*([^;\s]*)(?:;|\s|$)/;

/**
 * Checks if a type is compressible.
 * @param {string} type
 * @return {Boolean} compressible
 * @public
 */
const isCompressibleType = (type) => {
  if (!type || typeof type !== 'string'){ return false; } // Check if there is no type declared, if so, return false
  const match = extractTypeRegExp.exec(type);      // Strip Paramaters
  const mimeType = match && match[1].toLowerCase();
  const file = fs.readFileSync('src/database/cleanMimes.json', 'utf-8');
  const mimeDatabase = JSON.parse(file);
  const data = mimeDatabase[mimeType];

  if (data && data.compressible !== undefined){ return data.compressible; }   // return db info
  return compressibleTypeRegExp.test(mimeType) || undefined;
};
module.exports = isCompressibleType;

const isJSON = (body) => {
  if (!body){ return false; }
  if (typeof body === 'string'){ return false; }
  if (typeof body.pipe === 'function'){ return false; }
  if (typeof body === 'boolean'){ return false; }
  return !Buffer.isBuffer(body);
};
module.exports = isJSON;

const zlib = require('zlib');
const Stream = require('stream');
const isCompressible = require('./modules/isCompressible');
const stringToBytes = require('./modules/stringToBytes');
const isJSON = require('./modules/isJSON');
const httpCodes = require('./modules/httpCodes');

const encodingMethods = {
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate,
  brotli: zlib.createBrotliCompress,
};

/**
 * Koapress Middleware
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */

module.exports = (options = {}) => {
  let {filter = isCompressible, threshold = 1024} = options;
  if (typeof threshold === 'string'){ threshold = stringToBytes(threshold); }

  return async(ctx, next) => {
    ctx.vary('Accept-Encoding');
    await next();

    let {body} = ctx;
    if (!body){ return; }
    if (ctx.res.headersSent || !ctx.writable){ return; }
    if (ctx.compress === false){ return; }
    if (ctx.request.method === 'HEAD'){ return; }
    if (httpCodes.empty[ctx.response.status]){ return; }
    if (ctx.response.get('Content-Encoding')){ return; }

    // forced compression or implied
    if (!(ctx.compress === true || filter(ctx.response.type))){ return; }

    // identity
    const encoding = ctx.acceptsEncodings('gzip', 'deflate', 'identity');
    if (!encoding) ctx.throw(406, 'supported encodings: gzip, deflate, identity');
    if (encoding === 'identity') return;

    // json
    if (isJSON(body)){ body = ctx.body = JSON.stringify(body); }

    // threshold
    if (threshold && ctx.response.length < threshold) return;

    ctx.set('Content-Encoding', encoding);
    ctx.res.removeHeader('Content-Length');

    const stream = ctx.body = encodingMethods[encoding](options);

    if (body instanceof Stream) { body.pipe(stream); } else { stream.end(body); }
  };
};

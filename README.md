# Koapression

Koa Compression middleware.

The following compression codings are supported:

  - deflate
  - gzip
  - brotli

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @abaccus/koapression
```

## API

<!-- eslint-disable no-unused-vars -->

```js
const koapression = require('@abaccus/koapression')
```

## Example

```js
const koapression = require('@abaccus/koapression')
const Koa = require('koa')

const app = new Koa()
app.use(compress({
  filter: function (content_type) {
  	return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))
```

## Options

The options are passed to `zlib`: http://nodejs.org/api/zlib.html#zlib_options

### filter

An optional function that checks the response content type to decide whether to compress.
By default, it uses [compressible](https://github.com/expressjs/compressible).

### threshold

Minimum response size in bytes to compress.
Default `1024` bytes or `1kb`.

## Manually turning compression on and off

You can always enable compression by setting `this.compress = true`.
You can always disable compression by setting `this.compress = false`.
This bypasses the filter check.

```js
app.use((ctx, next) => {
  ctx.compress = true
  ctx.body = fs.createReadStream(file)
})
```

# concat-frames

Concatenates a pixel-stream into an array of frame objects. This is useful for testing purposes,
and cases where you want an entire image frame at once, rather than a stream.

## Installation

    npm install concat-frames

## Example

The following example produces an array of frames from an animated GIF
using [gif-stream](https://github.com/devongovett/gif-stream).

```javascript
var concat = require('concat-frames');
var GIFDecoder = require('gif-stream/decoder');

fs.createReadStream('in.gif')
  .pipe(new GIFDecoder)
  .pipe(concat(function(frames) {
    // frames is an array of frame objects.
    // each one has a `pixels` property containing
    // the raw RGB pixel data for that frame, as
    // well as the width, height, etc.
  }));
```

## License

MIT

var PixelStream = require('pixel-stream');
var inherits = require('util').inherits;

function ConcatFrames(callback) {
  if (!(this instanceof ConcatFrames))
    return new ConcatFrames(callback);
  
  PixelStream.call(this);
  
  this.frames = [];
  this.buffers = [];
  this.callback = callback;
  
  // put the stream in flowing mode
  this.resume();
}

inherits(ConcatFrames, PixelStream);

ConcatFrames.prototype._startFrame = function(frame, done) {
  frame.width = frame.width || this.format.width;
  frame.height = frame.height || this.format.height;
  frame.colorSpace = this.format.colorSpace;
  this.frames.push(frame);
  this.buffers = [];
  done();
};

ConcatFrames.prototype._writePixels = function(data, done) {
  this.buffers.push(data);
  done();
};

ConcatFrames.prototype._endFrame = function(done) {
  this.frames[this.frames.length - 1].pixels = Buffer.concat(this.buffers);
  done();
};

ConcatFrames.prototype._end = function(done) {
  this.callback(this.frames);
  done();
};

module.exports = ConcatFrames;

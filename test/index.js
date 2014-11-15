var PassThrough = require('stream').PassThrough;
var concat = require('../');
var assert = require('assert');

describe('concat-frames', function() {
  it('calls the callback with an array of frames', function(done) {
    var s = new PassThrough;
    s.width = 10;
    s.height = 10;
    s.colorSpace = 'rgb';
    
    s.pipe(concat(function(frames) {
      assert.equal(frames.length, 2);
      frames.forEach(function(f) {
        assert.equal(f.width, 10);
        assert.equal(f.height, 10);
        assert.equal(f.colorSpace, 'rgb');
        assert(Buffer.isBuffer(f.pixels));
        assert.equal(f.pixels.length, 10 * 10 * 3);
      });
      
      done();
    }));
    
    s.write(new Buffer(10 * 10 * 3));
    s.write(new Buffer(10 * 5 * 3));
    s.write(new Buffer(10 * 5 * 3));
    s.end();
  });
  
  it('uses frame objects', function(done) {
    var s = new PassThrough;
    
    s.pipe(concat(function(frames) {
      assert.equal(frames.length, 2);
      assert.equal(frames[0].width, 100);
      assert.equal(frames[0].height, 100);
      assert.equal(frames[0].colorSpace, 'rgb');
      assert.equal(frames[0].pixels.length, 100 * 100 * 3);
      assert.equal(frames[1].width, 10);
      assert.equal(frames[1].height, 10);
      assert.equal(frames[1].colorSpace, 'rgb');
      assert.equal(frames[1].pixels.length, 10 * 10 * 3);
      done();
    }));
    
    s.emit('frame', { index: 0, width: 100, height: 100 });
    s.write(new Buffer(100 * 100 * 3));
    
    s.emit('frame', { index: 1, width: 10, height: 10 })
    s.write(new Buffer(10 * 5 * 3));
    s.write(new Buffer(10 * 5 * 3));
    s.end();
  });
});

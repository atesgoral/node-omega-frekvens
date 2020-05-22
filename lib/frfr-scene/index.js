const path = require('path');

const { decodeFrames, StopSignal } = require('frfr');

module.exports = (dir) => {
  let frames = null;

  return {
    init() {
      frames = decodeFrames(path.join(dir, 'frames.ff'));
    },
    render(pixels) {
      pixels.set(frames.next().value.pixels);
    },
    cleanup() {
      frames.throw(new StopSignal());
    }
  };
};

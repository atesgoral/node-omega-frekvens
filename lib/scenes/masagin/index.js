const path = require('path');

const { decodeFrames, StopSignal } = require('frfr');

let frames = null;

function init() {
  frames = decodeFrames(path.join(__dirname, 'frames.ff'));
}

function render(pixels) {
  pixels.set(frames.next().value.pixels);
}

function cleanup() {
  frames.throw(new StopSignal());
}

module.exports = {
  init,
  render,
  cleanup
};

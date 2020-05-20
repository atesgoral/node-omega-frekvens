const path = require('path');

const { decodeFrames } = require('frfr');

let frames = null;

function init() {
  frames = decodeFrames(path.join(__dirname, 'frames.ff'));
}

function render(pixels) {
  pixels.set(frames.next().value.pixels);
}

function cleanup() {
  frames.throw();
}

module.exports = {
  init,
  render,
  cleanup
};

const path = require('path');

const { decodeFrames } = require('frfr');

let frames = null;

function init() {
  frames = decodeFrames(path.join(__dirname, 'frames.ff'));
}

function render(pixels, t, state) {
  if (isNaN(state.frame)) {
    state.frame = 0;
  }

  pixels.set(frames[state.frame].pixels);

  state.frame = (state.frame + 1) % frames.length;
}

function cleanup() {
  frames = null;
}

module.exports = {
  init,
  render,
  cleanup
};

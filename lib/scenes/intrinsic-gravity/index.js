const path = require('path');

const { decodeFrames } = require('frfr');

const frames = decodeFrames(path.join(__dirname, 'frames.ff'));

function render(pixels, t, state) {
  if (isNaN(state.frame)) {
    state.frame = 0;
  }

  pixels.set(frames[state.frame].pixels);

  state.frame = (state.frame + 1) % frames.length;
}

module.exports = {
  render
};

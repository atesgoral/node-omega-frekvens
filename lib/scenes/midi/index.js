const midi = require('midi');

function render(pixels) {
  for (let y = 0; y < 16; y++) {
    const v = midi.controls[y] >> 3;
    for (let x = 0; x < v; x++) {
      pixels[y * 16 + x] = 1;
    }
  }
}

module.exports = {
  render
};

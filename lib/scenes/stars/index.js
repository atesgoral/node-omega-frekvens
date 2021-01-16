const p = require('primitives');

const corners = 5;
const turn = 4 * Math.PI / corners;

function render(pixels, t) {
  for (let i = 0; i < corners; i++) {
    p.line(
      pixels,
      Math.cos(t + i * turn) * 7 + 8,
      Math.sin(t + i * turn) * 7 + 8,
      Math.cos(t + (i + 1) * turn) * 7 + 8,
      Math.sin(t + (i + 1) * turn) * 7 + 8
    );
  }
}

module.exports = {
  render
};

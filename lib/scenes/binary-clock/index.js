let epoch = null;
let frame = 0;

function init() {
  epoch = Date.now();
  frame = 0;
}

function render(pixels) {
  const now = new Date(epoch + frame * 1000 / 60);
  const comps = [now.getHours(), now.getMinutes(), now.getSeconds()];

  comps.forEach((comp, i) => {
    for (let bit = 0; bit < 6; bit++) {
      pixels[(i * 3 + 2) * 16 + 5 + bit] = comp >> (5 - bit) & 1;
    }
  });

  frame++;

  const f = frame % 60;

  pixels[((f / 12 | 0) + 10) * 16 + (f % 12) + 2] = 1;
}

module.exports = {
  init,
  render
};

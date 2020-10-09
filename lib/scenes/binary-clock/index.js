function render(pixels, t, state) {
  const millis = t * 1000;

  if (!state.epoch) {
    state.epoch = Date.now() - millis;
  }

  const now = new Date(state.epoch + millis);
  const comps = [now.getHours(), now.getMinutes(), now.getSeconds()];

  comps.forEach((comp, i) => {
    for (let bit = 0; bit < 6; bit++) {
      pixels[(i * 3 + 2) * 16 + 5 + bit] = comp >> (5 - bit) & 1;
    }
  });

  const frame = (t % 1) * 60 | 0;

  pixels[((frame / 12 | 0) + 10) * 16 + (frame % 12) + 2] = 1;
}

module.exports = {
  render
};

function render(pixels, t, state) {
  if (!state.epoch) {
    state.epoch = Date.now();
    state.frame = 0;
  }

  const now = new Date(state.epoch + state.frame * 1000 / 60);
  const comps = [now.getHours(), now.getMinutes(), now.getSeconds()];

  comps.forEach((comp, i) => {
    for (let bit = 0; bit < 6; bit++) {
      pixels[(i * 3 + 2) * 16 + 5 + bit] = comp >> (5 - bit) & 1;
    }
  });

  state.frame++;

  const frame = state.frame % 60;

  pixels[((frame / 12 | 0) + 10) * 16 + (frame % 12) + 2] = 1;
}

module.exports = {
  render
};

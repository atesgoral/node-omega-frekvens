function render(pixels, t, state) {
  for (let i = 0; i < 6; i++) {
    const x = Math.cos(t * 2 + i) * 8 + 8 | 0;
    const y = Math.sin(t * 3 - i) * 8 + 8 | 0;

    pixels[y * 16 + x] = 1;
  }
}

module.exports = {
  render
};

function render(pixels, t) {
  for (let i = 0; i < 16; i++) {
    const x = Math.sin(t * (i / 5 + 1)) * 8 + 8 | 0;
    const y = i;

    pixels[y * 16 + x] = 1;
  }
}

module.exports = {
  render
};

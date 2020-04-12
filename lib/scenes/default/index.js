function render(pixels, t, state) {
  const x1 = (Math.cos(t * 5) + 1) * 16 >> 1;
  const y1 = (Math.sin(t * 7) + 1) * 16 >> 1;

  pixels[y1 * 16 + x1] = 1;

  const x2 = (Math.cos(t * 2) + 1) * 16 >> 1;
  const y2 = (Math.sin(t * 6) + 1) * 16 >> 1;

  pixels[y2 * 16 + x2] = 1;
}

module.exports = {
  render
};

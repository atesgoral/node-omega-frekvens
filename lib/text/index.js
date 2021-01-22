const monogram = require('./fonts/monogram.json');

function renderChar(pixels, char, x, y) {
  const font = monogram;
  const data = font[char];
  const w = 5;
  const h = 9;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const X = c + x;
      const Y = r + y;
      if (
        X >= 0 &&
        X < 16 &&
        Y >=0 &&
        Y < 16 &&
        data[r] & (1 << c)
      ) {
        pixels[Y * 16 + X] = 1;
      }
    }
  }
  return w;
}

function renderText(pixels, text, x, y, k) {
  const font = monogram;
  let o = 0;
  k = k || font._k || 1;

  for (let i = 0; i < text.length; i++) {
    o += renderChar(pixels, text[i], x + o, y) + k;
  }
}

module.exports = {
  renderChar,
  renderText
};

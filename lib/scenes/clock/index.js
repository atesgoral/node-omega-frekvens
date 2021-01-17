const text = require('text');

function pad(n) {
  return ('0' + n).substr(-2);
}

function render(pixels) {
  const now = new Date();

  text.renderText(pixels, pad(now.getHours()).replace(/0/g, 'O'), 2, 0);
  text.renderText(pixels, pad(now.getMinutes()).replace(/0/g, 'O'), 2, 9);

  const sec = now.getSeconds();

  pixels[7 * 16 + 7] = sec & 1;
  pixels[7 * 16 + 8] = sec & 1 ^ 1;
  pixels[8 * 16 + 7] = sec & 1 ^ 1;
  pixels[8 * 16 + 8] = sec & 1;
}

module.exports = {
  render
};

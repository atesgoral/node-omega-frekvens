const text = require('text');

const message = 'monogram by datagoblin... THIS IS A REALLY NICE FONT!!!';
const speed = 6; // characters per second
const w = 6; // character width

const win = Math.ceil(16 / w) + 1;
const pre = Array(win).fill(' ').join('');
const chars = pre + message;

let epoch = null;

function render(pixels, t) {
  if (epoch === null) {
    epoch = t;
  }

  const elapsed = t - epoch;

  const u = elapsed * speed;
  const slice = chars.substr((u | 0) % chars.length, win);
  const scroll = (u % 1) * w | 0;

  text.renderText(pixels, slice, -scroll, 4);
}

module.exports = {
  render
};

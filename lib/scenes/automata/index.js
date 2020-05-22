let p = [];
let A = [];
let f = 0;
let qLast = 0;
let qLastLast = 0;

function init() {
  p = [];
  A = [];
  f = 0;
  qLast = 0;
  qLastLast = 0;
}

function render(pixels) {
  py = f % 32 > 15 ? 15 - (f % 16) : f % 16;
  py *= 16;

  for (q = i = 0; i < 16 * 15; i++)
    (p[i] = p[i + 16]),
      (q += ((i / 16) | 0) == 14 ? p[i] : 0),
      (q -= ((i / 16) | 0) == 13 ? p[i] : 0);

  if (f % 16 == 0)
    if ((q + 16) % 16 == 0 || q == qLastLast || f % (16 * 16) == 0)
      r = (Math.random() * 255) | 0;

  f++;

  qLastLast = qLast;
  qLast = q;

  for (a = i = 0; i < 16; i++)
    (A[i] = r & (2 ** (4 * a + 2 * (a = !!A[i]) + !!A[(i + 1) % 16]))),
      (p[i + 15 * 16] = !a);

  for (i = 16 * 16; i--; ) pixels[i] = p[i] ? 1 : 0;
}

module.exports = {
  init,
  render
};

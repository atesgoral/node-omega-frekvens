const font4 = {
  _w: 4,
  _h: 4,
  ' ': { w: 2, d: [
    '..',
    '..',
    '..',
    '..',
    '..',
  ]},
  ':': { w: 1, d: [
    '.',
    'X',
    '.',
    'X',
    '.',
  ]},
  '0': { d: [
    '.XX.',
    'X..X',
    'X..X',
    'X..X',
    '.XX.',
  ]},
  '1': { w: 1, d: [
    'X',
    'X',
    'X',
    'X',
    'X',
  ]},
  '2': { d: [
    'XXX.',
    '...X',
    '.XX.',
    'X...',
    'XXXX',
  ]},
  '3': { d: [
    'XXX.',
    '...X',
    '.XX.',
    '...X',
    'XXX.',
  ]},
  '4': { d: [
    'X..X',
    'X..X',
    'XXXX',
    '...X',
    '...X',
  ]},
  '5': { d: [
    'XXXX',
    'X...',
    'XXX.',
    '...X',
    'XXX.',
  ]},
  '6': { d: [
    '.XXX',
    'X...',
    'XXX.',
    'X..X',
    '.XX.',
  ]},
  '7': { d: [
    'XXXX',
    '...X',
    '...X',
    '...X',
    '...X',
  ]},
  '8': { d: [
    '.XX.',
    'X..X',
    '.XX.',
    'X..X',
    '.XX.',
  ]},
  '9': { d: [
    '.XX.',
    'X..X',
    '.XXX',
    '...X',
    'XXX.',
  ]},
  A: { d: [
    '.XX.',
    'X..X',
    'XXXX',
    'X..X',
    'X..X',
  ]},
  B: { d: [
    'XXX.',
    'X..X',
    'XXX.',
    'X..X',
    'XXX.',
  ]},
  C: { d: [
    '.XXX',
    'X...',
    'X...',
    'X...',
    '.XXX',
  ]},
  D: { d: [
    'XXX.',
    'X..X',
    'X..X',
    'X..X',
    'XXX.',
  ]},
};

const font5x7 = {
  _w: 5,
  _h: 7,
  _k: 2,
  '0': { d: [
'.XXX.',
'X...X',
'XX..X',
'X.X.X',
'X..XX',
'X...X',
'.XXX.',
  ]},
  '1': { d: [
'..X..',
'.XX..',
'..X..',
'..X..',
'..X..',
'..X..',
'.XXX.',
  ]},
  '2': { d: [
'.XXX.',
'X...X',
'....X',
'...X.',
'..X..',
'.X...',
'XXXXX',
  ]},
  '3': { d: [
'.XXX.',
'X...X',
'....X',
'..XX.',
'....X',
'X...X',
'.XXX.',
  ]},
  '4': { d: [
'...X.',
'..XX.',
'.X.X.',
'X..X.',
'XXXXX',
'...X.',
'...X.',
  ]},
  '5': { d: [
'XXXXX',
'X....',
'X....',
'XXXX.',
'....X',
'....X',
'XXXX.',
  ]},
  '6': { d: [
'.XXX.',
'X...X',
'X....',
'XXXX.',
'X...X',
'X...X',
'.XXX.',
  ]},
  '7': { d: [
'XXXXX',
'....X',
'...X.',
'..X..',
'..X..',
'..X..',
'..X..',
  ]},
  '8': { d: [
'.XXX.',
'X...X',
'X...X',
'.XXX.',
'X...X',
'X...X',
'.XXX.',
  ]},
  '9': { d: [
'.XXX.',
'X...X',
'X...X',
'.XXXX',
'....X',
'X...X',
'.XXX.',
  ]},
};

function drawChar(pixels, font, char, x, y) {
  const ch = font[char];
  const w = ch.w || font._w;
  const h = ch.h || font._h;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const X = c + x;
      const Y = r + y;
      if (
        X >= 0 &&
        X < 16 &&
        Y >=0 &&
        Y < 16 &&
        ch.d[r][c] === 'X'
      ) {
        pixels[(r + y) * 16 + c + x] = 1;
      }
    }
  }
  return w;
}

function drawText(pixels, font, s, x, y) {
  let o = 0;
  const k = font._k || 1;

  for (let i = 0; i < s.length; i++) {
    o += drawChar(pixels, font, s[i], x + o, y) + k;
  }
}

function pad(n) {
  return ('0' + n).substr(-2);
}

function render(pixels) {
  const now = new Date();
  drawText(pixels, font5x7, pad(now.getHours()), 2, 0);
  drawText(pixels, font5x7, pad(now.getMinutes()), 2, 9);

  const sec = now.getSeconds();

  pixels[7 * 16 + 7] = sec & 1;
  pixels[7 * 16 + 8] = sec & 1 ^ 1;
  pixels[8 * 16 + 7] = sec & 1 ^ 1;
  pixels[8 * 16 + 8] = sec & 1;
}

module.exports = {
  render
};

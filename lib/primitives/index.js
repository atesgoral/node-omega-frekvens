function _line(pixels, x1, y1, x2, y2) {
  const run = x2 - x1;
  const rise = y2 - y1;
  const slope = rise / run;

  if (Math.abs(slope) <= 1) {
    for (let x = x1; x <= x2; x++) {
      const dx = x - x1;
      const dy = dx * slope;
      const y = y1 + dy;

      pixels[Math.round(y) * 16 + Math.round(x)] = 1;
    }
  } else {
    if (y1 <= y2) {
      for (let y = y1; y <= y2; y++) {
        const dy = y - y1;
        const dx = dy / slope;
        const x = x1 + dx;

        pixels[Math.round(y) * 16 + Math.round(x)] = 1;
      }
    } else {
      for (let y = y2; y <= y1; y++) {
        const dy = y - y2;
        const dx = dy / slope;
        const x = x2 + dx;

        pixels[Math.round(y) * 16 + Math.round(x)] = 1;
      }
    }
  }
}

function line(pixels, x1, y1, x2, y2) {
  if (x1 < x2) {
    _line(pixels, x1, y1, x2, y2);
  } else {
    _line(pixels, x2, y2, x1, y1);
  }
}

module.exports = {
  line
};

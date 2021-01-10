
function render(pixels, t) {
  for (let y = 16; y--;)
    for (let x = 16; x--;)
      with (Math)
        pixels[i = y * 16 + x] = (y - tan(tan(sin(x / 5) * sin(y / 5 - t / 2)))) < -1;
}

module.exports = {
  render
};

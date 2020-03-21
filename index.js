const frekvens = require('./build/Release/binding');

const FPS = 60;

frekvens.start((event) => {
  console.log('event:', event);
});

const pixels = new Uint8Array(16 * 16);
const buffer = Buffer.from(pixels.buffer);

function drawDotAroundCircle() {
  const t = Date.now() / 1000;

  const x = Math.cos(t) * 8 + 8 | 0;
  const y = Math.sin(t) * 8 + 8 | 0;

  pixels[y * 16 + x] = 1;
}

function drawCalibrationBars() {
  for (let level = 0; level < 8; level++) {
    for (let x = 0; x < 16; x++) {
      pixels[level * 2 * 16 + x] = level;
    }
  }
}

setInterval(() => {
  pixels.fill(0);

  drawCalibrationBars();

  frekvens.render(buffer);
}, 1000 / FPS);

process.on('beforeExit', (code) => {
  frekvens.stop((event) => {
    console.log('event:', event);
  });
});

const frekvens = require('./build/Release/binding');

const pixels = new Uint8Array(16 * 16);
const buffer = Buffer.from(pixels.buffer);

frekvens.start(buffer, (event) => {
  console.log('event:', event);
});

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);

  frekvens.stop((event) => {
    console.log('event:', event);
  });
});

setInterval(() => {
  pixels.fill(0);

  const t = Date.now() / 1000;

  const x = Math.cos(t) * 6 + 8 | 0;
  const y = Math.sin(t) * 6 + 8 | 0;

  pixels[y * 16 + x] = 1;
  // pixels[(Math.sin(t) + 1) * 128 |0] = 1;
}, 1000 / 60);

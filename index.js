const frekvens = require('./build/Release/binding');

frekvens.start((event) => {
  console.log('event:', event);
});

const pixels = new Uint8Array(16 * 16);
const buffer = Buffer.from(pixels.buffer);

setInterval(() => {
  pixels.fill(0);

  const t = Date.now() / 1000;

  const x = Math.cos(t) * 8 + 8 | 0;
  const y = Math.sin(t) * 8 + 8 | 0;

  pixels[y * 16 + x] = 1;

  frekvens.render(buffer);
}, 1000 / 60);

process.on('beforeExit', (code) => {
  frekvens.stop((event) => {
    console.log('event:', event);
  });
});

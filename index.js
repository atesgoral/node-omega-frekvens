const frekvens = require('./build/Release/binding');

const buffer = Buffer.alloc(16 * 16);

for (let i = 0; i < 16 * 16; i++) {
  buffer[i] = i & 1;
}

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
  // draw frame
}, 1000 / 60);

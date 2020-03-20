const frekvens = require('./build/Release/binding');

const buffer = Buffer.alloc(16 * 16);

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
  buffer[Math.random() * 16 * 16 | 0] = Math.round(Math.random());
}, 1000 / 60);

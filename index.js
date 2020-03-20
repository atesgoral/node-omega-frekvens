const frekvens = require('./build/Release/binding');

frekvens.start((event) => {
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

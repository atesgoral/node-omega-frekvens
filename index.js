const frekvens = require('./build/Release/binding');

frekvens.start((event) => {
  console.log('event:', event);
});

setInterval(() => {
  // draw frame
}, 1000 / 60);

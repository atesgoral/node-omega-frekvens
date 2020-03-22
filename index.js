const dotenv = require('dotenv');
const socketIoClient = require('socket.io-client');

const frekvens = require('./build/Release/binding');

dotenv.config();

frekvens.start((event) => {
  console.log('event:', event);
});

const pixels = new Uint8Array(16 * 16);
const buffer = Buffer.from(pixels.buffer);

let renderFn = function (pixels, t) {
  const x = Math.cos(t) * 8 + 8 | 0;
  const y = Math.sin(t) * 8 + 8 | 0;

  pixels[y * 16 + x] = 1;
};

process.on('beforeExit', (code) => {
  frekvens.stop((event) => {
    console.log('event:', event);
  });
});

const socket = socketIoClient(process.env.WEBSOCKET_SERVER_URL);

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('identify', process.env.FREKVENS_CLIENT_SECRET);
});

socket.on('script', (script) => {
  console.log('Script updated');

  try {
    renderFn = new Function([ 'pixels', 't' ], script);
  } catch (error) {
    console.log('Syntax error in script:', error.message);
    renderFn = null;
    socket.emit('error', `Syntax error: ${error.message}`);
  }
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

setInterval(() => {
  pixels.fill(0);

  if (renderFn) {
    const t = Date.now() / 1000;

    try {
      renderFn(pixels, t);
    } catch (error) {
      console.log('Runtime error in script:', error.message);
      renderFn = null;
      socket.emit('error', `Runtime error: ${error.message}`);
    }
  }

  frekvens.render(buffer);
}, 1000 / 60);

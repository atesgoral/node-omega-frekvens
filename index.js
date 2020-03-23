const dotenv = require('dotenv');
const socketIoClient = require('socket.io-client');

const frekvens = require('./build/Release/binding');

dotenv.config();

frekvens.start((event) => {
  console.log('event:', event);
});

const pixels = new Uint8Array(16 * 16);
const buffer = Buffer.from(pixels.buffer);

const DEFAULT_RENDER_FN = function (pixels, t) {
  const x1 = Math.cos(t * 5) * 8 + 8 | 0;
  const y1 = Math.sin(t * 7) * 8 + 8 | 0;

  pixels[y1 * 16 + x1] = 1;

  const x2 = Math.cos(t * 2) * 8 + 8 | 0;
  const y2 = Math.sin(t * 6) * 8 + 8 | 0;

  pixels[y2 * 16 + x2] = 1;
};

let renderFn = DEFAULT_RENDER_FN;

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

socket.on('sync', (syncInfo) => {
  syncInfo.server = Date.now();
  socket.emit('syncResponse', syncInfo);
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

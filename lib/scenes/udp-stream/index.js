
const dgram = require('dgram');

let server = null;
let frame = null;

function init() {
  server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    server.close();
    server = null;
  });

  server.on('message', (msg) => {
    frame = {
      pixels: Uint8Array.from(msg.toString().replace(/\n/g, ',').split(','))
    };
  });

  server.bind(0x1337);
}

function render(pixels) {
  frame && pixels.set(frame.pixels);
}

function cleanup() {
  server && server.close();
  server = null;
  frame = null;
}

module.exports = {
  init,
  render,
  cleanup
};

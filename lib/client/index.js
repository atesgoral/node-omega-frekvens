const EventEmitter = require('events');

const socketIoClient = require('socket.io-client');

class Client extends EventEmitter {
  constructor({ serverUrl, clientSecret }) {
    super();

    const socket = socketIoClient(serverUrl);

    socket.on('connect', () => {
      this.emit('connect');
      socket.emit('identify', clientSecret);
    });

    socket.on('sync', (syncInfo) => {
      syncInfo.server = Date.now();
      socket.emit('syncResponse', syncInfo);
    });

    socket.on('script', (script) => this.emit('script', script));

    socket.on('disconnect', () => this.emit('disconnect'));

    this.send = (event, payload) => socket.connected && socket.emit(event, payload);
  }
}

module.exports = {
  Client
};

const EventEmitter = require('events');

const io = require('socket.io-client');

class Client extends EventEmitter {
  constructor({ serverUrl, clientSecret }) {
    super();

    const socket = io(serverUrl);

    socket.on('connect', () => {
      this.emit('connect');
      socket.emit('identify', clientSecret);
    });

    socket.on('sync', (syncInfo) => {
      syncInfo.server = Date.now();
      socket.emit('syncResponse', syncInfo);
    });

    socket.on('script', (script) => this.emit('script', script));
    socket.on('yellowDown', () => this.emit('yellowDown'));
    socket.on('yellowUp', () => this.emit('yellowUp'));
    socket.on('redDown', () => this.emit('redDown'));
    socket.on('redUp', () => this.emit('redUp'));

    socket.on('midi', (message) => this.emit('midi', message));

    socket.on('disconnect', () => this.emit('disconnect'));

    this.send = (event, payload) => socket.connected && socket.emit(event, payload);
  }
}

module.exports = {
  Client
};

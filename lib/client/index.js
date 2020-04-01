const EventEmitter = require('events');

const socketIoClient = require('socket.io-client');

class Client extends EventEmitter {
  constructor({ serverUrl, clientSecret }) {
    super();

    const socket = socketIoClient(serverUrl);

    socket.on('connect', () => {
      // frekvens.log(chalk.green('Connected'));
      socket.emit('identify', clientSecret);
    });

    socket.on('sync', (syncInfo) => {
      syncInfo.server = Date.now();
      socket.emit('syncResponse', syncInfo);
    });

    socket.on('script', (script) => {
      // frekvens.log('Script updated');
      this.emit('script', script);
    });

    socket.on('disconnect', () => {
      frekvens.log(chalk.magenta('Disconnected'));
    });
  }
}

module.exports = {
  Client
};

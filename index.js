const EventEmitter = require('events');
const execSync = require('child_process').execSync;

const dotenv = require('dotenv');
const socketIoClient = require('socket.io-client');
const chalk = require('chalk');

dotenv.config();

const frekvens = process.env.FAKEVENS
  ? require('./fakevens')
  : require('./build/Release/binding');

class ButtonAction extends EventEmitter {
  constructor(longPressDuration) {
    super();
    this.longPressDuration = longPressDuration;
    this.downAt = null;
    this.longPressTimeout = null;
  }

  down() {
    this.downAt = Date.now();
    this.emit('down');

    if (this.longPressTimeout) {
      clearTimeout(this.downTimeout);
    }

    this.longPressTimeout = setTimeout(
      () => this.emit('longPress'),
      this.longPressDuration
    );
  }

  up() {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    const wasDown = this.downAt !== null;

    this.downAt = null;
    this.emit('up');

    if (wasDown) {
      this.emit('press');
    }
  }
}

const socket = socketIoClient(process.env.WEBSOCKET_SERVER_URL);

const RED_LONG_PRESS = 10 * 1000;
const YELLOW_LONG_PRESS = 10 * 1000;

const redButton = new ButtonAction(RED_LONG_PRESS);
const yellowButton = new ButtonAction(YELLOW_LONG_PRESS);

let isBlackout = false;

redButton.on('down', () => {
  console.log(chalk.red('Red') + ' button down');
  socket.connected && socket.emit('buttonDown', 'red');
});

redButton.on('up', () => {
  console.log(chalk.red('Red') + ' button up');
  socket.connected && socket.emit('buttonUp', 'red');
});

redButton.on('press', () => {
  console.log(chalk.red('Red') + ' button press');
  isBlackout = !isBlackout;
});

redButton.on('longPress', () => {
  console.log(chalk.red('Red') + ' button long press');
  console.log(chalk.red('SHUTTING DOWN'));
  execSync('poweroff');
});

yellowButton.on('down', () => {
  console.log(chalk.yellow('Yellow') + ' button down');
  socket.connected && socket.emit('buttonDown', 'yellow');
});

yellowButton.on('up', () => {
  console.log(chalk.yellow('Yellow') + ' button up');
  socket.connected && socket.emit('buttonUp', 'yellow');
});

yellowButton.on('press', () => {
  console.log(chalk.yellow('Yellow') + ' button press');
  renderFn = DEFAULT_RENDER_FN;
});

yellowButton.on('longPress', () => {
  console.log(chalk.yellow('Yellow') + ' button long press');
  console.log(chalk.yellow('REBOOTING'));
  execSync('reboot');
});

frekvens.start((event) => {
  switch (event) {
    case 'RED_DOWN':
      redButton.down();
      break;
    case 'RED_UP':
      redButton.up();
      break;
    case 'YELLOW_DOWN':
      yellowButton.down();
      break;
    case 'YELLOW_UP':
      yellowButton.up();
      break;
  }
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

process.on('SIGINT', () => {
  console.log(chalk.magenta('Terminating'));
  frekvens.stop();
  process.exit();
});

socket.on('connect', () => {
  console.log(chalk.green('Connected'));
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
  console.log(chalk.magenta('Disconnected'));
});

setInterval(() => {
  pixels.fill(0);

  if (renderFn && !isBlackout) {
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


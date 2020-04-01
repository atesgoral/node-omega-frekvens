require('dotenv').config();

const chalk = require('chalk');

const frekvens = process.env.FAKEVENS
  ? require('fakevens')
  : require('frekvens');

const { ButtonAction } = require('./lib/button-action');
const { Client } = require('./lib/client');

const DEFAULT_RENDER_FN = function (pixels, t) {
  const x1 = Math.cos(t * 5) * 8 + 8 | 0;
  const y1 = Math.sin(t * 7) * 8 + 8 | 0;

  pixels[y1 * 16 + x1] = 1;

  const x2 = Math.cos(t * 2) * 8 + 8 | 0;
  const y2 = Math.sin(t * 6) * 8 + 8 | 0;

  pixels[y2 * 16 + x2] = 1;
};

const FPS = 60;

let renderInterval = null;

async function quit() {
  frekvens.log(chalk.magenta('Terminating'));

  clearInterval(renderInterval);

  await frekvens.stop();

  process.exit();
}

process.on('SIGINT', quit);

async function init() {
  let renderFn = DEFAULT_RENDER_FN;
  let isBlackout = false;

  const client = new Client({
    serverUrl: process.env.WEBSOCKET_SERVER_URL,
    clientSecret: process.env.FREKVENS_CLIENT_SECRET
  });

  client.on('connect', () => frekvens.log(chalk.green('Connected')));
  client.on('disconnect', () => frekvens.log(chalk.magenta('Disconnected')));

  client.on('script', (script) => {
    try {
      renderFn = new Function([ 'pixels', 't' ], script);
    } catch (error) {
      frekvens.log('Syntax error in script:', error.message);
      renderFn = null;
      // socket.emit('error', `Syntax error: ${error.message}`);
    }
  });

  const redButton = new ButtonAction({ longPressDuration: 10 * 1000 });
  const yellowButton = new ButtonAction({ longPressDuration: 10 * 1000 });

  redButton.on('down', () => {
    frekvens.log(chalk.red('Red') + ' button down');
    client.send('buttonDown', 'red');
  });

  redButton.on('up', () => {
    frekvens.log(chalk.red('Red') + ' button up');
    client.send('buttonUp', 'red');
  });

  redButton.on('press', () => {
    frekvens.log(chalk.red('Red') + ' button press');
    isBlackout = !isBlackout;
  });

  redButton.on('longPress', () => {
    frekvens.log(chalk.red('Red') + ' button long press');
    frekvens.log(chalk.red('POWERING OFF'));
    frekvens.powerOff();
  });

  yellowButton.on('down', () => {
    frekvens.log(chalk.yellow('Yellow') + ' button down');
    client.send('buttonDown', 'yellow');
  });

  yellowButton.on('up', () => {
    frekvens.log(chalk.yellow('Yellow') + ' button up');
    client.send('buttonUp', 'yellow');
  });

  yellowButton.on('press', () => {
    frekvens.log(chalk.yellow('Yellow') + ' button press');
    renderFn = DEFAULT_RENDER_FN;
  });

  yellowButton.on('longPress', () => {
    frekvens.log(chalk.yellow('Yellow') + ' button long press');
    frekvens.log(chalk.yellow('REBOOTING'));
    frekvens.reboot();
  });

  frekvens.on('redDown', () => redButton.down());
  frekvens.on('redUp', () => redButton.up());
  frekvens.on('yellowDown', () => yellowButton.down());
  frekvens.on('yellowUp', () => yellowButton.up());

  // Used for FAKEVENS only
  frekvens.on('quit', quit);

  const pixels = new Uint8Array(16 * 16);
  const buffer = Buffer.from(pixels.buffer);

  await frekvens.start();

  renderInterval = setInterval(() => {
    pixels.fill(0);

    if (renderFn && !isBlackout) {
      const t = Date.now() / 1000;

      try {
        renderFn(pixels, t);
      } catch (error) {
        frekvens.log('Runtime error in script:', error.message);
        renderFn = null;
        socket.emit('error', `Runtime error: ${error.message}`);
      }
    }

    frekvens.render(buffer);
  }, 1000 / FPS);
}

init();

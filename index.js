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
  if (process.env.LOG_SYSTEM) {
    frekvens.log(chalk.magenta('Terminating'));
  }

  clearInterval(renderInterval);

  await frekvens.stop();

  process.exit();
}

process.on('SIGINT', quit);

async function init() {
  if (process.env.LOG_SYSTEM) {
    frekvens.log(chalk.green('Initializing'));
  }

  let renderFn = DEFAULT_RENDER_FN;
  let isBlackout = false;

  function toggleBlackout() {
    isBlackout = !isBlackout;
  }

  function resetRenderFn() {
    renderFn = DEFAULT_RENDER_FN;
  }

  function compileScript(script) {
    try {
      renderFn = new Function([ 'pixels', 't' ], script);
    } catch (error) {
      frekvens.error(`Syntax error in script: ${error.message}`);
      renderFn = null;
      client.send('error', `Syntax error: ${error.message}`);
    }
  }

  const client = new Client({
    serverUrl: process.env.WEBSOCKET_SERVER_URL,
    clientSecret: process.env.FREKVENS_CLIENT_SECRET
  });

  client.on('script', compileScript);

  const redButton = new ButtonAction({ longPressDuration: 10 * 1000 });
  const yellowButton = new ButtonAction({ longPressDuration: 10 * 1000 });

  if (process.env.LOG_BUTTONS) {
    redButton.on('down', () => frekvens.log(chalk.red('Red') + ' button down'));
    redButton.on('up', () => frekvens.log(chalk.red('Red') + ' button up'));
    redButton.on('press', () => frekvens.log(chalk.red('Red') + ' button press'));
    redButton.on('longPress', () => frekvens.log(chalk.red('Red') + ' button long press'));

    yellowButton.on('down', () => frekvens.log(chalk.yellow('Yellow') + ' button down'));
    yellowButton.on('up', () => frekvens.log(chalk.yellow('Yellow') + ' button up'));
    yellowButton.on('press', () => frekvens.log(chalk.yellow('Yellow') + ' button press'));
    yellowButton.on('longPress', () => frekvens.log(chalk.yellow('Yellow') + ' button long press'));
  }

  if (process.env.LOG_CLIENT) {
    client.on('connect', () => frekvens.log(chalk.green('Connected')));
    client.on('disconnect', () => frekvens.log(chalk.magenta('Disconnected')));
  }

  if (process.env.LOG_SYSTEM) {
    redButton.on('longPress', () => frekvens.log(chalk.red('POWERING OFF')));
    yellowButton.on('longPress', () => frekvens.log(chalk.yellow('REBOOTING')));
  }

  redButton.on('down', () => client.send('buttonDown', 'red'));
  redButton.on('up', () => client.send('buttonUp', 'red'));
  redButton.on('press', toggleBlackout);
  redButton.on('longPress', () => frekvens.powerOff());

  yellowButton.on('down', () => client.send('buttonDown', 'yellow'));
  yellowButton.on('up', () => client.send('buttonUp', 'yellow'));
  yellowButton.on('press', resetRenderFn);
  yellowButton.on('longPress', () => frekvens.reboot());

  frekvens.on('redDown', () => redButton.down());
  frekvens.on('redUp', () => redButton.up());
  frekvens.on('yellowDown', () => yellowButton.down());
  frekvens.on('yellowUp', () => yellowButton.up());

  // Used for FAKEVENS only
  frekvens.on('quit', quit);

  await frekvens.start();

  const pixels = new Uint8Array(16 * 16);
  const buffer = Buffer.from(pixels.buffer);

  function renderFrame() {
    pixels.fill(0);

    if (renderFn && !isBlackout) {
      const t = Date.now() / 1000;

      try {
        renderFn(pixels, t);
      } catch (error) {
        frekvens.error(`Runtime error in script: ${error.message}`);
        renderFn = null;
        client.send('error', `Runtime error: ${error.message}`);
      }
    }

    frekvens.render(buffer);
  }

  renderInterval = setInterval(renderFrame, 1000 / FPS);
}

init();

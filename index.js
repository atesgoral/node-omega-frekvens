require('dotenv').config();

const chalk = require('chalk');

const frekvens = process.env.FAKEVENS
  ? require('fakevens')
  : require('frekvens');

const { ButtonAction } = require('./lib/button-action');
const { Client } = require('./lib/client');
const scenes = require('./lib/scenes');

const COLS = 16;
const ROWS = 16;
const FPS = 60;

const BUTTON_OFFSET = 4;
const BUTTON_DIAMETER = 3;

function buttonOverlay(x, y) {
  const buttonRows = [
    [ 0, 1, 0 ],
    [ 1, 1, 1 ],
    [ 0, 1, 0 ]
  ].map((row) => Uint8Array.from(row));

  return {
    render(pixels) {
      buttonRows.forEach((row, idx) => pixels.set(row, (y + idx) * COLS + x));
    }
  };
}

const overlays = {
  disconnected: {
    render(pixels, t) {
      if (t & 1) {
        pixels[1 * COLS + 1] = 1;
      }
    }
  },
  redButton: buttonOverlay(COLS - (BUTTON_DIAMETER + BUTTON_OFFSET), BUTTON_OFFSET),
  yellowButton: buttonOverlay(BUTTON_OFFSET, BUTTON_OFFSET),
  choke: {
    render(pixels) {
      pixels[(ROWS - 2) * COLS + COLS - 2] = 1;
    }
  }
};

let renderInterval = null;

async function quit() {
  if (process.env.LOG_SYSTEM) {
    frekvens.log(chalk`{magenta Terminating}`);
  }

  clearInterval(renderInterval);

  await frekvens.stop();

  process.exit();
}

process.on('SIGINT', quit);

async function init() {
  if (process.env.LOG_SYSTEM) {
    frekvens.log(chalk`{green Initializing}`);
  }

  let isBlackout = false;
  let currentScene = null;

  function toggleBlackout() {
    isBlackout = !isBlackout;
  }

  function getDefaultScene() {
    return {
      ...scenes.find((scene) => scene.id === 'default'),
      state: {}
    };
  }

  function nextScene() {
  }

  currentScene = getDefaultScene();

  function compileScript(script) {
    try {
      currentScene = {
        render: new Function([ 'pixels', 't', 'state' ], script),
        state: {}
      };
    } catch (error) {
      frekvens.error(`Syntax error in script: ${error.message}`);
      currentScene = null;
      client.send('error', `Syntax error: ${error.message}`);
    }
  }

  const client = new Client({
    serverUrl: process.env.WEBSOCKET_SERVER_URL,
    clientSecret: process.env.FREKVENS_CLIENT_SECRET
  });

  client.on('script', compileScript);

  if (process.env.OVERLAYS) {
    overlays.disconnected.isActive = true;

    client.on('connect', () => overlays.disconnected.isActive = false);
    client.on('disconnect', () => overlays.disconnected.isActive = true);
  }

  const redButton = new ButtonAction({ longPressDuration: 5 * 1000 });
  const yellowButton = new ButtonAction({ longPressDuration: 5 * 1000 });

  if (process.env.LOG_BUTTONS) {
    redButton.on('down', () => frekvens.log(chalk`{red Red} button down`));
    redButton.on('up', () => frekvens.log(chalk`{red Red} button up`));
    redButton.on('press', () => frekvens.log(chalk`{red Red} button press`));
    redButton.on('longPress', () => frekvens.log(chalk`{red Red} button long press`));

    yellowButton.on('down', () => frekvens.log(chalk`{yellow Yellow} button down`));
    yellowButton.on('up', () => frekvens.log(chalk`{yellow Yellow} button up`));
    yellowButton.on('press', () => frekvens.log(chalk`{yellow Yellow} button press`));
    yellowButton.on('longPress', () => frekvens.log(chalk`{yellow Yellow} button long press`));
  }

  if (process.env.LOG_CLIENT) {
    client.on('connect', () => frekvens.log(chalk`{green Connected}`));
    client.on('disconnect', () => frekvens.log(chalk`{magenta Disconnected}`));
  }

  if (process.env.LOG_SYSTEM) {
    redButton.on('longPress', () => frekvens.log(chalk`{red POWERING OFF}`));
    yellowButton.on('longPress', () => frekvens.log(chalk`{yellow REBOOTING}`));
  }

  redButton.on('down', () => client.send('buttonDown', 'red'));
  redButton.on('up', () => client.send('buttonUp', 'red'));
  redButton.on('press', toggleBlackout);
  redButton.on('longPress', () => frekvens.powerOff());

  yellowButton.on('down', () => client.send('buttonDown', 'yellow'));
  yellowButton.on('up', () => client.send('buttonUp', 'yellow'));
  yellowButton.on('press', nextScene);
  yellowButton.on('longPress', () => frekvens.reboot());

  if (process.env.OVERLAYS) {
    redButton.on('change', (isDown) => overlays.redButton.isActive = isDown);
    yellowButton.on('change', (isDown) => overlays.yellowButton.isActive = isDown);

    frekvens.on('choke', () => overlays.choke.isActive = true);
  }

  frekvens.on('redDown', () => redButton.down());
  frekvens.on('redUp', () => redButton.up());
  frekvens.on('yellowDown', () => yellowButton.down());
  frekvens.on('yellowUp', () => yellowButton.up());

  // Used for FAKEVENS only
  frekvens.on('quit', quit);

  let transform = Int8Array.from([
    1, 0,
    0, 1
  ]);

  if (process.env.ROTATE) {
    const turns = parseInt(process.env.ROTATE);
    const theta = Math.PI / 2 * turns;
    const sin = Math.round(Math.sin(theta));
    const cos = Math.round(Math.cos(theta));

    transform = Int8Array.from([
      cos, -sin,
      sin, cos
    ]);
  }

  await frekvens.start(transform);

  const pixels = new Uint8Array(COLS * ROWS);

  function renderFrame() {
    pixels.fill(0);

    if (!isBlackout) {
      const t = Date.now() / 1000;

      if (currentScene) {
        try {
          currentScene.render(pixels, t, currentScene.state);
        } catch (error) {
          frekvens.error(`Runtime error in script: ${error.message}`);
          currentScene = null;
          client.send('error', `Runtime error: ${error.message}`);
        }
      }

      Object.values(overlays)
        .filter((overlay) => overlay.isActive)
        .forEach((overlay) => overlay.render(pixels, t));

      overlays.choke.isActive = false;
    }

    frekvens.render(pixels);
  }

  renderInterval = setInterval(renderFrame, 1000 / FPS);
}

init();

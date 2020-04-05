const EventEmitter = require('events');
const path = require('path');

const { terminal, ScreenBufferHD, stringWidth } = require('terminal-kit');

const COLS = 16;
const ROWS = 16;
const PIXEL_RADIUS = 1;
const PIXEL_SPACING = 1;
const PIXEL_OC = 2 * PIXEL_RADIUS + PIXEL_SPACING; // center-to-center
const GUTTER = 2;
const CUBE_WIDTH = GUTTER * 2
  + PIXEL_RADIUS * 2 * COLS
  + PIXEL_SPACING * (COLS - 1);
const CUBE_HEIGHT = GUTTER * 2
  + PIXEL_RADIUS * 2 * ROWS
  + PIXEL_SPACING * (ROWS - 1);

const H_SCALE = 2;

const DIFFUSE_DISTANCE = 5;
const DIFFUSE_DIAMETER = DIFFUSE_DISTANCE * 2 + 1;
const diffuseFilter = Array(DIFFUSE_DIAMETER ** 2).fill(0);

for (let dy = 0; dy < DIFFUSE_DIAMETER; dy++) {
  for (let dx = 0; dx < DIFFUSE_DIAMETER; dx++) {
    const d = Math.sqrt(
      (dx - DIFFUSE_DISTANCE) ** 2 + (dy - DIFFUSE_DISTANCE) ** 2
    );
    const falloff = d > DIFFUSE_DISTANCE ? 1 : (d / (DIFFUSE_DISTANCE + 1)) ** .2;
    diffuseFilter[dy * DIFFUSE_DIAMETER + dx] = 1 - falloff;
  }
}

const eventEmitter = new EventEmitter();

const screen = new ScreenBufferHD({
  width: CUBE_WIDTH * H_SCALE,
  height: CUBE_HEIGHT,
  dst: terminal,
  noFill: true,
  blending: true
});

async function loadSprite(fileName) {
  return ScreenBufferHD.loadImage(path.join(__dirname, 'sprites', fileName));
}

async function loadSprites() {
  return {
    led: await loadSprite('led.png')
  };
}

function quit() {
  eventEmitter.emit('quit');
}

const buttons = {
  red: { isDown: false, upTimeout: null },
  yellow: { isDown: false, upTimeout: null }
};

function pressButton(buttonName) {
  const button = buttons[buttonName];

  if (!button.isDown) {
    button.isDown = true;
    eventEmitter.emit(`${buttonName}Down`);
  }

  if (button.upTimeout) {
    clearTimeout(button.upTimeout);
  }

  button.upTimeout = setTimeout(() => {
    button.upTimeout = null;
    button.isDown = false;
    eventEmitter.emit(`${buttonName}Up`);
  }, 250);
}

async function start() {
  terminal.on('key', (name) => {
    switch (name) {
      case 'ESCAPE':
        quit();
        break;
      case 'r':
        pressButton('red');
        break;
      case 'y':
        pressButton('yellow');
        break;
      }
  });

  screen.sprites = await loadSprites();

  terminal.hideCursor(true);
  terminal.fullscreen(true);
  terminal.grabInput(true);
}

async function stop() {
  terminal.hideCursor(false);
  terminal.fullscreen(false);
  terminal.grabInput(false);
  terminal.clear();
}

function render(pixels, transform) {
  if (!screen.sprites) {
    return;
  }

  screen.fill({
    attr: {
      color: { r: 13, g: 13, b: 13 },
      bgColor: { r: 13, g: 13, b: 13 }
    }
  });

  const levels = Array(16 * 16).fill(0);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      for (let dy = 0; dy < DIFFUSE_DIAMETER; dy++) {
        const y = row + dy - DIFFUSE_DISTANCE;

        if (y < 0 || y >= ROWS) {
          continue;
        }

        for (let dx = 0; dx < DIFFUSE_DIAMETER; dx++) {
          const x = col + dx - DIFFUSE_DISTANCE;

          if (x < 0 || x >= COLS) {
            continue;
          }

          levels[y * COLS + x] = Math.min(
            1,
            levels[y * COLS + x]
              + pixels[row * COLS + col] * diffuseFilter[dy * DIFFUSE_DIAMETER + dx]
          );
        }
      }
    }
  }

  const colCx2 = COLS - 1;
  const rowCx2 = ROWS - 1;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const opacity = levels[row * COLS + col] * 0.95 + 0.05;
      const colNx2 = col * 2 - colCx2;
      const rowNx2 = row * 2 - rowCx2;
      const colT = colCx2
        + colNx2 * transform[0]
        + rowNx2 * transform[1]
        >> 1;
      const rowT = rowCx2
        + colNx2 * transform[2]
        + rowNx2 * transform[3]
        >> 1;

      screen.sprites.led.draw({
        dst: screen,
        x: (GUTTER + colT * PIXEL_OC) * 2,
        y: GUTTER + rowT * PIXEL_OC,
        blending: { opacity }
      });
    }
  }

  screen.draw({ delta: true });
}

function log(s) {
  const padding = ' '.repeat(
    Math.max(
      0,
      (CUBE_WIDTH - GUTTER * 2) * H_SCALE - stringWidth(s)
    )
  );

  terminal.bgColorRgb(13, 13, 13).moveTo(
    GUTTER * H_SCALE + 1,
    CUBE_HEIGHT,
    s + padding
  ).bgDefaultColor();
}

function error(s) {
  log(s);
}

module.exports = {
  start,
  stop,
  render,
  on: eventEmitter.on.bind(eventEmitter),
  log,
  error,
  powerOff: quit,
  reboot: quit
};

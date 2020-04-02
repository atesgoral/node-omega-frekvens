const EventEmitter = require('events');
const path = require('path');

const { terminal, ScreenBuffer } = require('terminal-kit');

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

const eventEmitter = new EventEmitter();

const screen = new ScreenBuffer({
  width: CUBE_WIDTH * H_SCALE,
  height: CUBE_HEIGHT,
  dst: terminal,
  noFill: true,
  blending: true
});

async function loadSprite(fileName) {
  return ScreenBuffer.loadImage(path.join(__dirname, 'sprites', fileName));
}

async function loadSprites() {
  return {
    ledOffSprite: await loadSprite('led_off.png'),
    ledOnSprite: await loadSprite('led_on.png')
  };
}

function quit() {
  eventEmitter.emit('quit');
}

async function start() {
  terminal.on('key', (name) => {
    if (name === 'ESCAPE') {
      quit();
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

function render(pixels) {
  if (!screen.sprites) {
    return;
  }

  screen.fill({
    attr: { bgColor: 'black' }
  });

  const { ledOnSprite, ledOffSprite } = screen.sprites;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const sprite = pixels[row * COLS + col]
        ? ledOnSprite
        : ledOffSprite;

      sprite.draw({
        dst: screen,
        x: (GUTTER + col * PIXEL_OC) * 2,
        y: GUTTER + row * PIXEL_OC,
        blending: false
      });
    }
  }

  screen.draw({ delta: true });

  // terminal.moveTo(
  //   0,
  //   CUBE_HEIGHT,
  //   '^:^-Press ^!ESC^:^- to quit'
  // );
}

function log(s) {

}

function error(s) {

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

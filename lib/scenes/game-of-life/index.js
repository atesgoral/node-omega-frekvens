let cells = null;
let prevTick = null;

const neighbours = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 }
];

function nextGeneration(current) {
  const next = current.map((row) => row.slice());

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const neighbourCount = neighbours.reduce((count, vector) => {
        return count + current[(row + vector.y + 16) % 16][(col + vector.x + 16) % 16];
      }, 0);

      if (current[row][col]) {
        if (neighbourCount < 2 || neighbourCount > 3) {
          next[row][col] = 0;
        }
      } else {
        if (neighbourCount === 3) {
          next[row][col] = 1;
        }
      }
    }
  }

  return next;
}

function init() {
  cells = Array(16).fill().map(() => {
    return Array(16).fill().map(() => Math.random() < 0.5);
  });
}

function render(pixels, t) {
  const tick = t * 8 | 0;

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      if (cells[row][col]) {
        pixels[row * 16 + col] = 1;
      }
    }
  }

  if (tick !== prevTick) {
    prevTick = tick;
    cells = nextGeneration(cells);
  }
}

function cleanup() {
  cells = null;
}

module.exports = {
  init,
  render,
  cleanup
};

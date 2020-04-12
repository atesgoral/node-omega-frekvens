function render(pixels, t, state) {
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

  const tick = t * 8 | 0;

  if (!state.cells) {
    state.cells = Array(16).fill().map(() => {
      return Array(16).fill().map(() => Math.random() < 0.5);
    });
    state.prevTick = tick;
  }

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      if (cells[row][col]) {
        pixels[row * 16 + col] = 1;
      }
    }
  }

  if (tick !== state.prevTick) {
    state.prevTick = tick;
    state.cells = nextGeneration(state.cells);
  }
}

module.exports = {
  render
};

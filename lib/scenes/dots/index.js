const motions = [
  (i, t) => ({
    x: Math.cos(t) * 8 + 8,
    y: Math.sin(t) * 8 + 8
  }),
  (i, t) => ({
    x: Math.cos(t + Math.PI / 3 * i) * 8 + 8,
    y: Math.sin(t + Math.PI / 3 * i) * 8 + 8
  }),
  (i, t) => ({
    x: Math.cos(t * 2 + i) * 8 + 8,
    y: Math.sin(t * 3 - i) * 8 + 8
  }),
  (i, t) => ({
    x: (Math.cos(t * (i * 7591 % 5 + 1)) + 1) * 8,
    y: (Math.sin(t * (i * 7607 % 7 + 1)) + 1) * 8
  }),
  (i, t) => ({
    x: Math.sin(t * (i / 5 + 1)) * 8 + 8,
    y: i + 5
  })
]

function lerp(p1, p2, t) {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

function render(pixels, t) {
  const slowT = t / 10;
  const motionIdx = slowT % motions.length | 0;
  const nextMotionIdx = (motionIdx + 1) % motions.length;
  const lerpT = (slowT % 1) ** 4;

  for (let i = 0; i < 6; i++) {
    const { x, y } = lerp(
      motions[motionIdx](i, t),
      motions[nextMotionIdx](i, t),
      lerpT
    );

    pixels[(y << 4) + x | 0] = 1;
  }
}

module.exports = {
  render
};

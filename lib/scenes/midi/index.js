const midi = require('midi');

function render(pixels, t) {
  const particles = (midi.controls[0] || 0) + 1;
  const phaseSpread = (midi.controls[1] || 0) / 128;
  // const angularVel1 = (midi.controls[2] || 0) / 128 + 1;
  // const angularVel2 = (midi.controls[3] || 0) / 128 + 1;

  const angularVel1 = (midi.controls[4] || 0) / 128 + 1;
  const angularVel2 = (midi.controls[5] || 0) / 128 + 1;
  // const angularVel3 = (midi.controls[6] || 0) / 128 + 1;
  // const angularVel4 = (midi.controls[7] || 0) / 128 + 1;

  const radius = (midi.controls[8] || 0) / 128;
  const radiusSpread = (midi.controls[9] || 0) / 128;
  (midi.controls[10] || 0) / 128;
  (midi.controls[11] || 0) / 128;

  (midi.controls[12] || 0) / 128;
  (midi.controls[13] || 0) / 128;
  (midi.controls[14] || 0) / 128;
  (midi.controls[15] || 0) / 128;

  for (let i = 0; i < particles; i++) {
    const I = i / particles;
    const I2PI = I * Math.PI * 2;
    const r = 8 * radius * (1 - radiusSpread * Math.sin(I * Math.PI));
    const x = Math.cos(t * 5 * angularVel1 + I2PI * phaseSpread) * r + 8;
    const y = Math.sin(t * 5 * angularVel1 * angularVel2 + I2PI * phaseSpread) * r + 8;

    pixels[Math.floor(y) * 16 + Math.floor(x)] = 1;
  }

  // for (let r = 0; r < 4; r++) {
  //   for (let c = 0; c < 4; c++) {
  //     const p = (midi.controls[r * 4 + c] | 0) / 128;
  //     const x = Math.cos(t * 5 + p * Math.PI) * 2 * p + 2 + c * 4;
  //     const y = Math.sin(t * 5 + p * Math.PI) * 2 * p + 2 + r * 4;
  //     pixels[Math.floor(y) * 16 + Math.floor(x)] = 1;
  //   }
  // }

  // for (let y = 0; y < 16; y++) {
  //   for (let x = 0; x < 16; x++) {
  //     const v = midi.controls[(y & 0b1100) + (x >> 2)];
  //     const Y = y & 3;
  //     const X = x & 3;
  //     pixels[y * 16 + x] = (v >> 3) >= (Y * 4 + X);
  //   }
  //   // for (let x = 0; x < v; x++) {
  //   //   pixels[y * 16 + x] = 1;
  //   // }
  // }
  // for (let i = 0; i < 16; i++) {
  //   const x = Math.sin(t * (midi.controls[i] / 128 + 1)) * 8 + 8 | 0;
  //   const y = i;

  //   pixels[y * 16 + x] = 1;
  // }
}

module.exports = {
  render
};

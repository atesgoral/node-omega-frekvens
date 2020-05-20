const fs = require('fs');

function readBytes(fd, typedArray) {
  const buffer = Buffer.from(typedArray.buffer);
  const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);

  if (bytesRead !== buffer.length) {
    throw new Error('Not enough bytes read');
  }
}

function decodeFrames(framesPath) {
  const fd = fs.openSync(framesPath, 'r');

  const headerArray = new Uint8Array(4);
  const versionArray = new Uint8Array(4);
  const frameCountArray = new Uint32Array(1);

  readBytes(fd, headerArray);

  if (Buffer.compare(Buffer.from('FRFR'), headerArray) !== 0) {
    throw new Error('Invalid header');
  }

  readBytes(fd, versionArray);

  if (Buffer.compare(Buffer.from([ 0, 0, 0, 1 ]), versionArray) !== 0) {
    throw new Error('Incompatible version');
  }

  readBytes(fd, frameCountArray);

  const frameCount = frameCountArray[0];
  const frames = [];

  const nArray = new Uint32Array(1);
  const rowArray = new Uint16Array(16);

  let n = null;
  let pixels = null;

  while (frames.length < frameCount) {
    readBytes(fd, nArray);
    readBytes(fd, rowArray);

    n = nArray[0];
    pixels = new Uint8Array(16 * 16);

    rowArray.forEach((encodedRow, y) => {
      for (let x = 0; x < 16; x++) {
        pixels[y * 16 + x] = encodedRow >> x & 1;
      }
    });

    frames.push({
      n,
      pixels
    });
  }

  fs.closeSync(fd);

  return frames;
}

module.exports = {
  decodeFrames
};

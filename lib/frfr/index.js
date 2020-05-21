const fs = require('fs');

class StopSignal extends Error {}

function readBytes(fd, typedArray, position) {
  const buffer = Buffer.from(typedArray.buffer);
  const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, position);

  if (bytesRead !== buffer.length) {
    throw new Error('Not enough bytes read');
  }

  return bytesRead;
}

function* decodeFrames(framesPath) {
  const fd = fs.openSync(framesPath, 'r');
  let pos = 0;

  try {
    const headerArray = new Uint8Array(4);
    const versionArray = new Uint8Array(4);
    const frameCountArray = new Uint32Array(1);

    pos += readBytes(fd, headerArray, pos);

    if (Buffer.compare(Buffer.from('FRFR'), headerArray) !== 0) {
      throw new Error('Invalid header');
    }

    pos += readBytes(fd, versionArray, pos);

    if (Buffer.compare(Buffer.from([ 0, 0, 0, 1 ]), versionArray) !== 0) {
      throw new Error('Incompatible version');
    }

    const frameCountPos = pos;

    let frameCount = null;
    let frameIdx = 0;

    const nArray = new Uint32Array(1);
    const rowArray = new Uint16Array(16);
    const pixels = new Uint8Array(16 * 16);

    let n = null;

    while (true) {
      if (frameIdx === 0) {
        pos = frameCountPos + readBytes(fd, frameCountArray, frameCountPos);
        frameCount = frameCountArray[0];
      }

      pos += readBytes(fd, nArray, pos);
      pos += readBytes(fd, rowArray, pos);

      n = nArray[0];

      rowArray.forEach((encodedRow, y) => {
        for (let x = 0; x < 16; x++) {
          pixels[y * 16 + x] = encodedRow >> x & 1;
        }
      });

      yield {
        n,
        pixels
      };

      frameIdx = (frameIdx + 1) % frameCount;
    }
  } catch (error) {
    if (!(error instanceof StopSignal)) {
      throw error;
    }
  } finally {
    fs.closeSync(fd);
  }
}

module.exports = {
  decodeFrames,
  StopSignal
};

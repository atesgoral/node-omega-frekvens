const controls = [];

function process(message) {
  const { status, data1, data2 } = message;

  const channel = status & 0x0f;
  const type = status & 0xf0;
  const note = data1;
  const velocity = data2;

  switch (type) {
    case 0x80:
      // Note off
      // midiNotes[note].isOn = false;
      // midiNotes[note].offVelocity = velocity;
      // midiNotes[note].offTimeStamp = timeStamp;
      break;
    case 0x90:
      // Note on
      // midiNotes[note].isOn = true;
      // midiNotes[note].onVelocity = velocity;
      // midiNotes[note].onTimeStamp = timeStamp;
      break;
    case 0xa0:
      // Polyphonic key pressure
      break;
    case 0xb0:
      // Control change
      controls[note] = velocity;
      break;
    case 0xc0:
      // Program change
      break;
    case 0xd0:
      // Channel pressure
      break;
    case 0xe0:
      // Pitch bend
      break;
    case 0xf0:
      // System message
      return;
  }
}

module.exports = {
  process,
  controls
};

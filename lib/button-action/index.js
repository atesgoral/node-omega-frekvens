const EventEmitter = require('events');

class ButtonAction extends EventEmitter {
  constructor({ longPressDuration }) {
    super();
    this.longPressDuration = longPressDuration;
    this.downAt = null;
    this.longPressTimeout = null;
  }

  down() {
    this.downAt = Date.now();
    this.emit('down');

    if (this.longPressTimeout) {
      clearTimeout(this.downTimeout);
    }

    this.longPressTimeout = setTimeout(
      () => this.emit('longPress'),
      this.longPressDuration
    );
  }

  up() {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    const wasDown = this.downAt !== null;

    this.downAt = null;
    this.emit('up');

    if (wasDown) {
      this.emit('press');
    }
  }
}

module.exports = {
  ButtonAction
};

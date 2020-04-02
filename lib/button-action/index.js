const EventEmitter = require('events');

class ButtonAction extends EventEmitter {
  constructor({ longPressDuration }) {
    super();
    this.longPressDuration = longPressDuration;
    this.isDown = false;
    this.longPressTimeout = null;
  }

  down() {
    this.isDown = true;
    this.emit('down');
    this.emit('change', this.isDown);

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

    const wasDown = this.isDown;

    this.isDown = false;
    this.emit('up');
    this.emit('change', this.isDown);

    if (wasDown) {
      this.emit('press');
    }
  }
}

module.exports = {
  ButtonAction
};

const EventEmitter = require('events');
const execSync = require('child_process').execSync;

const driver = require('./build/Release/driver');

const eventEmitter = new EventEmitter();

let startResolver = null;
let stopResolver = null;

function eventHandler(eventName) {
  switch (eventName) {
    case 'STARTED':
      startResolver && startResolver();
      break;
    case 'STOPPED':
      stopResolver && stopResolver();
      break;
    case 'RED_DOWN':
      eventEmitter.emit('redDown');
      break;
    case 'RED_UP':
      eventEmitter.emit('redUp');
      break;
    case 'YELLOW_DOWN':
      eventEmitter.emit('yellowDown');
      break;
    case 'YELLOW_UP':
      eventEmitter.emit('yellowUp');
      break;
    }
}

function start() {
  return new Promise((resolve) => {
    startResolver = resolve;
    driver.start(eventHandler);
  });
}

function stop() {
  return new Promise((resolve) => {
    stopResolver = resolve;
    driver.stop();
  });
}

function powerOff() {
  execSync('poweroff');
}

function reboot() {
  execSync('reboot');
}

module.exports = {
  start,
  stop,
  render: driver.render,
  on: eventEmitter.on.bind(eventEmitter),
  log: console.log,
  powerOff,
  reboot
};

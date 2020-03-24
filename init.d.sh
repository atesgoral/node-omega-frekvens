#!/bin/sh /etc/rc.common

START=10
STOP=15

start() {
  echo "Starting FREKVENS"
  cd /root/node-omega-frekvens
  node index.js &
}

stop() {
  echo "Stopping FREKVENS"
  killall -s SIGINT node
}

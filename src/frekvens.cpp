#include <uv.h>

#include "frekvens.h"
#include "fastgpioomega2.h"

#define GPIO_INPUT 0
#define GPIO_OUTPUT 1

#define PIN_LATCH 2
#define PIN_CLOCK 1
#define PIN_DATA 0

#define PIN_RED_BUTTON 19
#define PIN_YELLOW_BUTTON 18

int draw = 1;

void gpioLoop(void *pArg) {
  FastGpioOmega2 gpio;

  gpio.SetDirection(PIN_LATCH, GPIO_OUTPUT);
  gpio.SetDirection(PIN_CLOCK, GPIO_OUTPUT);
  gpio.SetDirection(PIN_DATA, GPIO_OUTPUT);

  gpio.SetDirection(PIN_RED_BUTTON, GPIO_INPUT);
  gpio.SetDirection(PIN_YELLOW_BUTTON, GPIO_INPUT);

  gpio.Set(PIN_LATCH, 0);
  gpio.Set(PIN_CLOCK, 0);
  gpio.Set(PIN_DATA, 0);

  int pixels[16 * 16] = { 0 };

  int f = 0;
  int prevRedButtonDown = 0;
  int prevYellowButtonDown = 0;

  while (1) {
    for (int i = 0; i < 16 * 16; i++) {
      gpio.Set(PIN_DATA, pixels[i]);

      gpio.Set(PIN_CLOCK, 1);
      usleep(1);
      gpio.Set(PIN_CLOCK, 0);
      usleep(1);
    }

    gpio.Set(PIN_LATCH, 1);
    usleep(1);
    gpio.Set(PIN_LATCH, 0);
    usleep(1);

    f++;

    int redButtonDown;
    int yellowButtonDown;

    gpio.Read(PIN_RED_BUTTON, redButtonDown);
    gpio.Read(PIN_YELLOW_BUTTON, yellowButtonDown);

    if (redButtonDown != prevRedButtonDown) {
      prevRedButtonDown = redButtonDown;

      if (redButtonDown) {
        draw ^= 1;
      }
    }

    if (yellowButtonDown != prevYellowButtonDown) {
      prevYellowButtonDown = yellowButtonDown;

      if (yellowButtonDown) {
        f = 0;
      }
    }

    for (int y = 0; y < 16; y++) {
      for (int x = 0; x < 16; x++) {
        pixels[((x & 8) << 4) + (x & 7) + (y << 3)] = (x + f) & y ? 1 : 0;
      }
    }

    usleep(1000 * 1000 / 60);
  }
}

namespace FREKVENS {
  void start() {
    uv_thread_t id;
    uv_thread_create(&id, gpioLoop, 0);
  }

  void stop() {

  }

  void render() {

  }
}



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

char buffer1[16 * 16] = {};
char buffer2[16 * 16] = {};

char *buffer = buffer1;
char *offScreenBuffer = buffer2;

void gpioLoop(void *pArg) {
  uv_mutex_t bufferLock = *(uv_mutex_t *)pArg;

  FastGpioOmega2 gpio;

  gpio.SetDirection(PIN_LATCH, GPIO_OUTPUT);
  gpio.SetDirection(PIN_CLOCK, GPIO_OUTPUT);
  gpio.SetDirection(PIN_DATA, GPIO_OUTPUT);

  gpio.SetDirection(PIN_RED_BUTTON, GPIO_INPUT);
  gpio.SetDirection(PIN_YELLOW_BUTTON, GPIO_INPUT);

  gpio.Set(PIN_LATCH, 0);
  gpio.Set(PIN_CLOCK, 0);
  gpio.Set(PIN_DATA, 0);

  int f = 0;
  int prevRedButtonDown = 0;
  int prevYellowButtonDown = 0;

  while (1) {
    uv_mutex_lock(&bufferLock);

    for (int half = 0; half < 2; half++) {
      for (int row = 0; row < 16; row++) {
        for (int col = 0; col < 8; col++) {
          gpio.Set(PIN_DATA, buffer[row * 16 + col + half * 8]);

          gpio.Set(PIN_CLOCK, 1);
          usleep(1);
          gpio.Set(PIN_CLOCK, 0);
          usleep(1);
        }
      }
    }

    uv_mutex_unlock(&bufferLock);

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

    usleep(1000 * 1000 / 60);
  }
}

uv_mutex_t bufferLock;

namespace FREKVENS {
  void start() {
    uv_mutex_init(&bufferLock);

    uv_thread_t id;
    uv_thread_create(&id, gpioLoop, &bufferLock);
  }

  void stop() {
  }

  void render(const char *pixels) {
    memcpy(offScreenBuffer, pixels, 16 * 16);

    uv_mutex_lock(&bufferLock);

    char *swap = buffer;
    buffer = offScreenBuffer;
    offScreenBuffer = swap;

    uv_mutex_unlock(&bufferLock);
  }
}




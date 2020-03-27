#include <chrono>
#include <uv.h>

#include "../lib/fastgpio/fastgpioomega2.h"

#include "FREKVENS.h"

#include "DoubleBuffer.h"
#include "Renderer.h"

#define GPIO_INPUT 0
#define GPIO_OUTPUT 1

#define PIN_LATCH 2
#define PIN_CLOCK 1
#define PIN_DATA 0

#define PIN_RED_BUTTON 19
#define PIN_YELLOW_BUTTON 18

#define TARGET_FPS 60

using namespace std;

void sleepNano(long long nano) {
  struct timespec req = {0};
  time_t sec = (int)(nano / 1000000000LL);
  unsigned long nsec = nano - (((long long)sec) * 1000000000LL);
  req.tv_sec = sec;
  req.tv_nsec = nsec;
  while (nanosleep(&req, &req) == -1) {
    continue;
  }
}

long long timeNowNS() {
  auto now = chrono::high_resolution_clock::now();
  long long nowNS = chrono::time_point_cast<chrono::nanoseconds>(now).time_since_epoch().count();
  return nowNS;
}

DoubleBuffer doubleBuffer;

void gpioLoop(void *pArg) {
  DoubleBuffer &doubleBuffer = *(DoubleBuffer *)pArg;

  FastGpioOmega2 gpio;

  gpio.SetDirection(PIN_LATCH, GPIO_OUTPUT);
  gpio.SetDirection(PIN_CLOCK, GPIO_OUTPUT);
  gpio.SetDirection(PIN_DATA, GPIO_OUTPUT);

  gpio.SetDirection(PIN_RED_BUTTON, GPIO_INPUT);
  gpio.SetDirection(PIN_YELLOW_BUTTON, GPIO_INPUT);

  gpio.Set(PIN_LATCH, 0);
  gpio.Set(PIN_CLOCK, 0);
  gpio.Set(PIN_DATA, 0);

  int prevRedButtonDown = 0;
  int prevYellowButtonDown = 0;

  long long maxFrameInterval = 1000000000LL / TARGET_FPS;

  while (1) {
    long long start = timeNowNS();

    const char *pBuffer = doubleBuffer.acquire();

    if (!pBuffer) {
      break;
    }

    for (int half = 0; half < 2; half++) {
      for (int row = 0; row < 16; row++) {
        for (int col = 0; col < 8; col++) {
          gpio.Set(PIN_DATA, pBuffer[row * 16 + col + half * 8]);

          gpio.Set(PIN_CLOCK, 1);
          gpio.Set(PIN_CLOCK, 0);
        }
      }
    }

    doubleBuffer.release();

    gpio.Set(PIN_LATCH, 1);
    gpio.Set(PIN_LATCH, 0);

    int redButtonDown;
    int yellowButtonDown;

    gpio.Read(PIN_RED_BUTTON, redButtonDown);
    gpio.Read(PIN_YELLOW_BUTTON, yellowButtonDown);

    if (redButtonDown != prevRedButtonDown) {
      prevRedButtonDown = redButtonDown;

      if (redButtonDown) {
      }
    }

    if (yellowButtonDown != prevYellowButtonDown) {
      prevYellowButtonDown = yellowButtonDown;

      if (yellowButtonDown) {
      }
    }

    long long elapsed = timeNowNS() - start;
    long long toGo = maxFrameInterval - elapsed;

    if (toGo > 0) {
      sleepNano(toGo);
    } else {
      printf("!");
    }
  }
}

uv_thread_t renderer;

namespace FREKVENS {
  void start() {
    uv_thread_create(&renderer, gpioLoop, &doubleBuffer);
  }

  void stop() {
    doubleBuffer.clear();

    uv_thread_join(&renderer);
  }

  void render(const char *pixels) {
    doubleBuffer.set(pixels);
  }
}

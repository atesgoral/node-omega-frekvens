#include "Renderer.h"

#include <uv.h>

#include "../lib/fastgpio/fastgpioomega2.h"
#include "../lib/libnewgpio/hdr/TimeHelper.h"

#include "DoubleBuffer.h"

#define GPIO_INPUT 0
#define GPIO_OUTPUT 1

#define PIN_LATCH 2
#define PIN_CLOCK 1
#define PIN_DATA 0

#define PIN_RED_BUTTON 19
#define PIN_YELLOW_BUTTON 18

#define TARGET_FPS 60

void Renderer::gpioLoop(void *pArg) {
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

void Renderer::start() {
  uv_thread_create(&m_thread, gpioLoop, &m_doubleBuffer);
}

void Renderer::render(const char *pBuffer) {
  m_doubleBuffer.set(pBuffer);
}

void Renderer::stop() {
  m_doubleBuffer.clear();

  uv_thread_join(&m_thread);
}

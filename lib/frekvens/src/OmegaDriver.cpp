#include "OmegaDriver.h"

#include "../lib/fastgpio/fastgpioomega2.h"
#include "../lib/libnewgpio/hdr/TimeHelper.h"

#define GPIO_INPUT 0
#define GPIO_OUTPUT 1

#define PIN_LATCH 2
#define PIN_CLOCK 1
#define PIN_DATA 0

#define PIN_RED_BUTTON 19
#define PIN_YELLOW_BUTTON 18

#define TARGET_FPS 60

#define COLS 16
#define ROWS 16
#define HALVES 2 // In case the meaning of the word "half" changes

void OmegaDriver::gpioLoop(void *pArg) {
  OmegaDriver &driver = *reinterpret_cast<OmegaDriver *>(pArg);
  RenderBuffer &renderBuffer = driver.m_renderBuffer;

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

  char colCx2 = COLS - 1;
  char rowCx2 = ROWS - 1;
  auto &transform = &driver.m_transform;

  driver.queueEvent("STARTED");

  while (1) {
    long long start = timeNowNS();

    const char *pBuffer = renderBuffer.read();

    for (int half = 0; half < HALVES; half++) {
      for (int row = 0; row < ROWS; row++) {
        for (int col = 0; col < COLS / 2; col++) {
          char colNx2 = (col + half * 8) * 2 - colCx2;
          char rowNx2 = row * 2 - rowCx2;
          char colT = (colCx2
            + colNx2 * transform[0]
            + rowNx2 * transform[1])
            >> 1;
          char rowT = (rowCx2
            + colNx2 * transform[2]
            + rowNx2 * transform[3])
            >> 1;

          gpio.Set(PIN_DATA, pBuffer[rowT * 16 + colT]);

          gpio.Set(PIN_CLOCK, 1);
          gpio.Set(PIN_CLOCK, 0);
        }
      }
    }

    gpio.Set(PIN_LATCH, 1);
    gpio.Set(PIN_LATCH, 0);

    if (!driver.m_isRunning) {
      break;
    }

    int redButtonDown;
    int yellowButtonDown;

    gpio.Read(PIN_RED_BUTTON, redButtonDown);
    gpio.Read(PIN_YELLOW_BUTTON, yellowButtonDown);

    if (redButtonDown != prevRedButtonDown) {
      prevRedButtonDown = redButtonDown;

      if (redButtonDown) {
        driver.queueEvent("RED_DOWN");
      } else {
        driver.queueEvent("RED_UP");
      }
    }

    if (yellowButtonDown != prevYellowButtonDown) {
      prevYellowButtonDown = yellowButtonDown;

      if (yellowButtonDown) {
        driver.queueEvent("YELLOW_DOWN");
      } else {
        driver.queueEvent("YELLOW_UP");
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

void OmegaDriver::queueEvent(const char *szEventName) {
  m_eventQueue.push(szEventName);
  uv_async_send(&m_eventHandle);
}

void OmegaDriver::start(const EventCallback eventCallback, const char *pTransform) {
  m_eventCallback = eventCallback;
  memcpy(m_transform, pTransform, sizeof m_transform);
  m_isRunning = true;

  uv_async_init(uv_default_loop(), &m_eventHandle, [](uv_async_t *pHandle) -> void {
    OmegaDriver &driver = *reinterpret_cast<OmegaDriver *>(pHandle->data);

    vector<string> &queue = driver.m_eventQueue.read();

    for (vector<string>::const_iterator it = queue.begin(); it != queue.end(); ++it) {
      driver.m_eventCallback((*it).c_str());
    }
  });

  m_eventHandle.data = this;

  uv_thread_create(&m_thread, gpioLoop, this);
}

void OmegaDriver::render(const char *pPixels) {
  m_renderBuffer.set(pPixels);
}

void OmegaDriver::stop() {
  m_renderBuffer.clear();
  m_isRunning = false;
  uv_thread_join(&m_thread);
  queueEvent("STOPPED");
}

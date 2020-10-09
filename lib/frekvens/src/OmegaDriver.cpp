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

#define COLS 16
#define ROWS 16
#define HALVES 2 // In case the meaning of the word "half" changes

FastGpioOmega2 gpio;

int prevRedButtonDown = 0;
int prevYellowButtonDown = 0;

void OmegaDriver::start(const EventCallback eventCallback, const char *pTransform) {
  m_eventCallback = eventCallback;
  memcpy(m_transform, pTransform, sizeof m_transform);

  gpio.SetDirection(PIN_LATCH, GPIO_OUTPUT);
  gpio.SetDirection(PIN_CLOCK, GPIO_OUTPUT);
  gpio.SetDirection(PIN_DATA, GPIO_OUTPUT);

  gpio.SetDirection(PIN_RED_BUTTON, GPIO_INPUT);
  gpio.SetDirection(PIN_YELLOW_BUTTON, GPIO_INPUT);

  gpio.Set(PIN_LATCH, 0);
  gpio.Set(PIN_CLOCK, 0);
  gpio.Set(PIN_DATA, 0);

  m_eventCallback("STARTED");
}

void OmegaDriver::render(const char *pPixels) {
  char colCx2 = COLS - 1;
  char rowCx2 = ROWS - 1;

  for (int half = 0; half < HALVES; half++) {
    for (int row = 0; row < ROWS; row++) {
      for (int col = 0; col < COLS / 2; col++) {
        char colNx2 = (col + half * 8) * 2 - colCx2;
        char rowNx2 = row * 2 - rowCx2;
        char colT = (colCx2
          + colNx2 * m_transform[0]
          + rowNx2 * m_transform[1])
          >> 1;
        char rowT = (rowCx2
          + colNx2 * m_transform[2]
          + rowNx2 * m_transform[3])
          >> 1;

        gpio.Set(PIN_DATA, pPixels[rowT * 16 + colT]);

        gpio.Set(PIN_CLOCK, 1);
        gpio.Set(PIN_CLOCK, 0);
      }
    }
  }

  gpio.Set(PIN_LATCH, 1);
  gpio.Set(PIN_LATCH, 0);

  int redButtonDown;
  int yellowButtonDown;

  gpio.Read(PIN_RED_BUTTON, redButtonDown);
  gpio.Read(PIN_YELLOW_BUTTON, yellowButtonDown);

  if (redButtonDown != prevRedButtonDown) {
    prevRedButtonDown = redButtonDown;

    if (redButtonDown) {
      m_eventCallback("RED_DOWN");
    } else {
      m_eventCallback("RED_UP");
    }
  }

  if (yellowButtonDown != prevYellowButtonDown) {
    prevYellowButtonDown = yellowButtonDown;

    if (yellowButtonDown) {
      m_eventCallback("YELLOW_DOWN");
    } else {
      m_eventCallback("YELLOW_UP");
    }
  }
}

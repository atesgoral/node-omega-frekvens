#ifndef _RENDERER_H_
#define _RENDERER_H_

#include <uv.h>

#include "DoubleBuffer.h"

class Renderer {
  DoubleBuffer m_doubleBuffer;
  uv_thread_t m_thread;

  static void gpioLoop(void *pArg);

public:
  void start();
  void render(const char *pBuffer);
  void stop();
};

#endif // _RENDERER_H_

#ifndef _RENDERER_H_
#define _RENDERER_H_

#include <atomic>

#include <uv.h>

#include "SafeBuffer.h"

class Renderer {
  SafeBuffer m_safeBuffer;
  std::atomic<bool> m_isRunning;
  uv_thread_t m_thread;

  static void gpioLoop(void *pArg);

public:
  void start();
  void render(const char *pBuffer);
  void stop();
};

#endif // _RENDERER_H_

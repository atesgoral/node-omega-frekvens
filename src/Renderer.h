#ifndef _RENDERER_H_
#define _RENDERER_H_

#include <string>
#include <atomic>
#include <functional>

#include <uv.h>

#include "SafeBuffer.h"
#include "SafeQueue.h"

class Renderer {
  typedef std::function<void(const char *)> SwitchEventCallback;

  SafeBuffer m_safeBuffer;
  SafeQueue m_switchEventQueue;
  std::atomic<bool> m_isRunning;
  uv_thread_t m_thread;

  static void gpioLoop(void *pArg);

public:
  void start(const SwitchEventCallback &switchEventCallback);
  void render(const char *pBuffer);
  void stop();
};

#endif // _RENDERER_H_

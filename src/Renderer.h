#ifndef _RENDERER_H_
#define _RENDERER_H_

#include <string>
#include <atomic>
#include <functional>

#include <uv.h>

#include "RenderBuffer.h"
#include "EventQueue.h"

class Renderer {
  typedef void (*SwitchEventCallback)(const char *szEventName);

  RenderBuffer m_renderBuffer;
  EventQueue m_switchEventQueue;
  SwitchEventCallback m_switchEventCallback;
  std::atomic<bool> m_isRunning;
  uv_async_t m_switchEventHandle;
  uv_thread_t m_thread;

  static void gpioLoop(void *pArg);

  void queueEvent(const char *szEventName);

public:
  void start(const SwitchEventCallback switchEventCallback);
  void render(const char *pBuffer);
  void stop();
};

#endif // _RENDERER_H_

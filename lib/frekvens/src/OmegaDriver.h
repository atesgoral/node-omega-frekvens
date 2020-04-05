#ifndef _OMEGADRIVER_H_
#define _OMEGADRIVER_H_

#include <string>
#include <atomic>
#include <functional>

#include <uv.h>

#include "RenderBuffer.h"
#include "EventQueue.h"

class OmegaDriver {
  typedef void (*EventCallback)(const char *szEventName);

  RenderBuffer m_renderBuffer;
  EventQueue m_eventQueue;
  EventCallback m_eventCallback;
  std::atomic<bool> m_isRunning;
  uv_async_t m_eventHandle;
  uv_thread_t m_thread;

  static void gpioLoop(void *pArg);

  void queueEvent(const char *szEventName);

public:
  void start(const EventCallback eventCallback);
  void render(const char *pPixels, const char *pTransform);
  void stop();
};

#endif // _OMEGADRIVER_H_

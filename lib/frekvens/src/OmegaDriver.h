#ifndef _OMEGADRIVER_H_
#define _OMEGADRIVER_H_

#include <string>
#include <atomic>
#include <functional>

class OmegaDriver {
  typedef void (*EventCallback)(const char *szEventName);

  EventCallback m_eventCallback;
  char m_transform[4];

public:
  void start(const EventCallback eventCallback, const char *pTransform);
  void render(const char *pPixels);
  void stop();
};

#endif // _OMEGADRIVER_H_

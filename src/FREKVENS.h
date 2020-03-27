#ifndef _FREKVENS_H_
#define _FREKVENS_H_

#include <functional>


namespace FREKVENS {
  typedef std::function<void(const char *)> SwitchEventCallback;

  void start(const SwitchEventCallback switchEventCallback);
  void render(const char *pBuffer);
  void stop();
}

#endif // _FREKVENS_H_

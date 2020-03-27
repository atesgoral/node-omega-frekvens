#include "FREKVENS.h"

#include "Renderer.h"

Renderer renderer;

namespace FREKVENS {
  SwitchEventCallback switchEventCallbackRef;

  void cb(const char *szEventName) {
    //SwitchEventCallbackRef(szEventName);
  }

  void start(const SwitchEventCallback switchEventCallback) {
    switchEventCallbackRef = switchEventCallback;

    renderer.start(cb);
  }

  void render(const char *pBuffer) {
    renderer.render(pBuffer);
  }

  void stop() {
    renderer.stop();
  }
}

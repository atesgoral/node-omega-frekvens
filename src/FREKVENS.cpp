#include "FREKVENS.h"

#include "Renderer.h"

Renderer renderer;

namespace FREKVENS {
  void start(const SwitchEventCallback switchEventCallback) {
    renderer.start([&switchEventCallback](const char *szEventName) -> void {
      switchEventCallback(szEventName);
    });
  }

  void render(const char *pBuffer) {
    renderer.render(pBuffer);
  }

  void stop() {
    renderer.stop();
  }
}

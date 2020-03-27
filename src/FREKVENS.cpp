#include "FREKVENS.h"

#include "Renderer.h"

Renderer renderer;

namespace FREKVENS {
  void start(const SwitchEventCallback switchEventCallback) {
    renderer.start(switchEventCallback);
  }

  void render(const char *pBuffer) {
    renderer.render(pBuffer);
  }

  void stop() {
    renderer.stop();
  }
}

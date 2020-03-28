#include "FREKVENS.h"

#include "Renderer.h"

Renderer renderer;

namespace FREKVENS {
  void start(const EventCallback eventCallback) {
    renderer.start(eventCallback);
  }

  void render(const char *pBuffer) {
    renderer.render(pBuffer);
  }

  void stop() {
    renderer.stop();
  }
}

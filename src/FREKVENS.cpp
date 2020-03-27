#include "FREKVENS.h"

#include "Renderer.h"

Renderer renderer;

namespace FREKVENS {
  void start() {
    renderer.start();
  }

  void render(const char *pBuffer) {
    renderer.render(pBuffer);
  }

  void stop() {
    renderer.stop();
  }
}

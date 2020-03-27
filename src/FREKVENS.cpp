#include <chrono>
#include <uv.h>

#include "FREKVENS.h"

#include "DoubleBuffer.h"
#include "Renderer.h"

DoubleBuffer doubleBuffer;

uv_thread_t renderer;

namespace FREKVENS {
  void start() {
    uv_thread_create(&renderer, Renderer::gpioLoop, &doubleBuffer);
  }

  void stop() {
    doubleBuffer.clear();

    uv_thread_join(&renderer);
  }

  void render(const char *pixels) {
    doubleBuffer.set(pixels);
  }
}

#include <node.h>
#include <v8.h>
#include <uv.h>

#include <fastgpioomega2.h>

#define GPIO_INPUT 0
#define GPIO_OUTPUT 1

#define PIN_R 17
#define PIN_G 16
#define PIN_B 15

#define PIN_LATCH 2
#define PIN_CLOCK 1
#define PIN_DATA 0

#define PIN_RED_BUTTON 19
#define PIN_YELLOW_BUTTON 18

void renderer(void *pArg) {
  FastGpioOmega2 gpio;

  gpio.SetDirection(PIN_R, GPIO_OUTPUT);
  gpio.SetDirection(PIN_G, GPIO_OUTPUT);
  gpio.SetDirection(PIN_B, GPIO_OUTPUT);

  gpio.SetDirection(PIN_LATCH, GPIO_OUTPUT);
  gpio.SetDirection(PIN_CLOCK, GPIO_OUTPUT);
  gpio.SetDirection(PIN_DATA, GPIO_OUTPUT);

  gpio.SetDirection(PIN_RED_BUTTON, GPIO_INPUT);
  gpio.SetDirection(PIN_YELLOW_BUTTON, GPIO_INPUT);

  gpio.Set(PIN_R, 1);
  gpio.Set(PIN_G, 1);
  gpio.Set(PIN_B, 1);

  gpio.Set(PIN_LATCH, 0);
  gpio.Set(PIN_CLOCK, 0);
  gpio.Set(PIN_DATA, 0);

  int pixels[16 * 16] = { 0 };

  int f = 0;
  int redPressed = 0;
  int yellowPressed = 0;

  while (1) {
    for (int i = 0; i < 16 * 16; i++) {
      gpio.Set(PIN_DATA, pixels[i]);

      gpio.Set(PIN_CLOCK, 1);
      usleep(1);
      gpio.Set(PIN_CLOCK, 0);
      usleep(1);
    }

    gpio.Set(PIN_LATCH, 1);
    usleep(1);
    gpio.Set(PIN_LATCH, 0);
    usleep(1);

    f++;

    // gpio.Set(PIN_R, f & 1);
    // gpio.Set(PIN_G, f >> 1 & 1);
    // gpio.Set(PIN_B, f >> 2 & 1);

    gpio.Read(PIN_RED_BUTTON, redPressed);
    gpio.Read(PIN_YELLOW_BUTTON, yellowPressed);

    if (redPressed) {
      gpio.Set(PIN_R, 0);
    } else if (yellowPressed) {
      gpio.Set(PIN_R, 0);
      gpio.Set(PIN_G, 0);
    } else {
      gpio.Set(PIN_R, 1);
      gpio.Set(PIN_G, 1);
    }

    for (int y = 0; y < 16; y++) {
      for (int x = 0; x < 16; x++) {
        pixels[((x & 8) << 4) + (x & 7) + (y << 3)] = (x + f) & y ? 1 : 0;
      }
    }

    usleep(1000 * 1000 / 60);
  }
}

void Method(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate *pIsolate = args.GetIsolate();

  v8::Local<v8::Function> cb = v8::Local<v8::Function>::Cast(args[0]);

  uv_thread_t id;
  uv_thread_create(&id, renderer, 0);

  args.GetReturnValue().Set(v8::Undefined(pIsolate));
}

void init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  NODE_SET_METHOD(module, "exports", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

#include <node.h>
#include <v8.h>

#include <fastgpioomega2.h>

#define FASTGPIO_VERBOSITY_QUIET    (0)
#define FASTGPIO_VERBOSITY_NORMAL    (1)
#define FASTGPIO_VERBOSITY_ALL      (2)
#define FASTGPIO_VERBOSITY_JSON      (3)

#define FASTGPIO_DEFAULT_VERBOSITY    (FASTGPIO_VERBOSITY_NORMAL)
#define FASTGPIO_DEFAULT_DEBUG      (0)

#define FASTGPIO_VERBOSE  0
#define FASTGPIO_DEBUG     0

void Method(const v8::FunctionCallbackInfo<v8::Value>& args) {
  const int PIN_R = 17;
  const int PIN_G = 16;
  const int PIN_B = 15;

  const int PIN_LATCH = 2;
  const int PIN_CLOCK = 1;
  const int PIN_DATA = 0;

  FastGpioOmega2 *gpioObj = new FastGpioOmega2();

  gpioObj->SetDirection(PIN_R, 1); // set to output
  gpioObj->SetDirection(PIN_G, 1); // set to output
  gpioObj->SetDirection(PIN_B, 1); // set to output

  gpioObj->Set(PIN_R, 0);
  gpioObj->Set(PIN_G, 1);
  gpioObj->Set(PIN_B, 0);

  v8::Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(v8::String::NewFromUtf8(
        isolate, "world", v8::NewStringType::kNormal).ToLocalChecked());
}

void init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  NODE_SET_METHOD(module, "exports", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

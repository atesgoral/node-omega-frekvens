#include <node.h>
#include <v8.h>

#include "frekvens.h"

void start(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate *pIsolate = args.GetIsolate();

  // v8::Local<v8::Function> cb = v8::Local<v8::Function>::Cast(args[0]);

  FREKVENS::start();

  args.GetReturnValue().Set(v8::Undefined(pIsolate));
}

void stop(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate *pIsolate = args.GetIsolate();

  FREKVENS::stop();

  args.GetReturnValue().Set(v8::Undefined(pIsolate));
}

void render(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate *pIsolate = args.GetIsolate();

  FREKVENS::render();

  args.GetReturnValue().Set(v8::Undefined(pIsolate));
}

void init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  NODE_SET_METHOD(exports, "start", start);
  NODE_SET_METHOD(exports, "stop", stop);
  NODE_SET_METHOD(exports, "render", render);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

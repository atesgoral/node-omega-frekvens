#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include "frekvens.h"

using namespace v8;
using namespace node;

void start(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  char *buffer = (char *)Buffer::Data(args[0]->ToObject());
  // Local<Function> cb = Local<Function>::Cast(args[1]);

  FREKVENS::start(buffer);

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void stop(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  FREKVENS::stop();

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void render(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  FREKVENS::render();

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(exports, "start", start);
  NODE_SET_METHOD(exports, "stop", stop);
  NODE_SET_METHOD(exports, "render", render);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include "FREKVENS.h"

using namespace v8;
using namespace node;

Isolate *_pIsolate;
Persistent<Function> _switchEventCallback;

void switchEventCallback(const char *szEventName) {
  Handle<Value> argv[1];
  argv[0] = String::NewFromUtf8(_pIsolate, szEventName);

  Local<Function>::New(_pIsolate, _switchEventCallback)->Call(_pIsolate->GetCurrentContext()->Global(), 1, argv);
}

void start(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  _pIsolate = pIsolate;
  // Persistent<Function> switchEventCallback;
  _switchEventCallback.Reset(pIsolate, Local<Function>::Cast(args[0]));

  FREKVENS::start(switchEventCallback);

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void stop(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  FREKVENS::stop();

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void render(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  const char *pixels = Buffer::Data(args[0]->ToObject());

  FREKVENS::render(pixels);

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(exports, "start", start);
  NODE_SET_METHOD(exports, "stop", stop);
  NODE_SET_METHOD(exports, "render", render);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

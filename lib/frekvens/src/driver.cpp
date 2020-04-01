#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include "OmegaDriver.h"

using namespace v8;
using namespace node;

OmegaDriver driver;

Isolate *_pIsolate;
Persistent<Function> _eventCallback;

void eventCallback(const char *szEventName) {
  HandleScope handleScope(_pIsolate);
  Handle<Value> argv[1];
  argv[0] = String::NewFromUtf8(_pIsolate, szEventName);

  Local<Function>::New(_pIsolate, _eventCallback)->Call(_pIsolate->GetCurrentContext()->Global(), 1, argv);
}

void start(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  _pIsolate = pIsolate;
  _eventCallback.Reset(pIsolate, Local<Function>::Cast(args[0]));

  driver.start(eventCallback);

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void stop(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  driver.stop();

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void render(const FunctionCallbackInfo<Value>& args) {
  Isolate *pIsolate = args.GetIsolate();

  const char *pBuffer = Buffer::Data(args[0]->ToObject());

  driver.render(pBuffer);

  args.GetReturnValue().Set(Undefined(pIsolate));
}

void init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(exports, "start", start);
  NODE_SET_METHOD(exports, "stop", stop);
  NODE_SET_METHOD(exports, "render", render);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

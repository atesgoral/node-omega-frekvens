#include "switchhandler.h"

void SwitchHandler::fireHandler(uv_async_t *pHandle) {
  SwitchHandler &switchHandler = *reinterpret_cast<SwitchHandler *>(pHandle->data);
  switchHandler.redSwitchDown();
}

SwitchHandler::SwitchHandler(Isolate *pIsolate, Local<Function> &cb) : m_pIsolate(pIsolate) {
  m_cb.Reset(pIsolate, cb);

  uv_async_init(uv_default_loop(), &m_handle, fireHandler);

  m_handle.data = this;
}

void SwitchHandler::redSwitchDown() {
  // Handle<Value> argv[1];
   Local<Function>::New(m_pIsolate, m_cb)->Call(m_pIsolate->GetCurrentContext()->Global(), 0, 0);
}

void SwitchHandler::yellowSwitchDown() {

}

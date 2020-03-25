#ifndef _SWITCHHANDLER_H_
#define _SWITCHHANDLER_H_

#include <v8.h>
#include <uv.h>

#include "frekvens.h"

using namespace v8;

class SwitchHandler : public FREKVENS::ISwitchHandler {
private:
  Isolate *m_pIsolate;
  Persistent<Function> m_cb;
  uv_async_t m_handle;

  static void fireHandler(uv_async_t *pHandle);

public:
  SwitchHandler(Isolate *pIsolate, Local<Function> &cb);

  virtual void redSwitchDown() override;
  virtual void yellowSwitchDown() override;
};

#endif // _SWITCHHANDLER_H_

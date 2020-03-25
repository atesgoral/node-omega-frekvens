#ifndef _FREKVENS_H_
#define _FREKVENS_H_

namespace FREKVENS {
  class ISwitchHandler {
  public:
    virtual void redSwitchDown() = 0;
    virtual void yellowSwitchDown() = 0;
  };

  void start(ISwitchHandler &switchHandler);
  void stop();
  void render(const char *pixels);
}

#endif // _FREKVENS_H_

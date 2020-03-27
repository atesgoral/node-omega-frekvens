#ifndef _DOUBLEBUFFER_H_
#define _DOUBLEBUFFER_H_

#include <uv.h>

class DoubleBuffer {
  char m_buffer1[16 * 16] = { 0 };
  char m_buffer2[16 * 16] = { 0 };

  char *m_pBuffer;
  char *m_pOffScreenBuffer;

  uv_mutex_t m_bufferLock;
public:
  DoubleBuffer();

  void clear();
  void set(const char *pBuffer);

  const char *acquire();
  void release();
};

#endif // _DOUBLEBUFFER_H_

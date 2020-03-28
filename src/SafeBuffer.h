#ifndef _SAFEBUFFER_H_
#define _SAFEBUFFER_H_

#include <uv.h>

class SafeBuffer {
  char m_buffer1[16 * 16] = { 0 };
  char m_buffer2[16 * 16] = { 0 };

  char *m_pBuffer;
  char *m_pOffScreenBuffer;

  uv_mutex_t m_bufferLock;

public:
  SafeBuffer();
  ~SafeBuffer();

  void clear();
  void set(const char *pBuffer);

  const char *read();
};

#endif // _SAFEBUFFER_H_

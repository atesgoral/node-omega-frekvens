#ifndef _RENDERBUFFER_H_
#define _RENDERBUFFER_H_

#include <uv.h>

class RenderBuffer {
  char m_buffer1[16 * 16] = { 0 };
  char m_buffer2[16 * 16] = { 0 };

  char *m_pBuffer;
  char *m_pOffScreenBuffer;

  uv_mutex_t m_bufferLock;

public:
  RenderBuffer();
  ~RenderBuffer();

  void clear();
  void set(const char *pBuffer);

  const char *read();
};

#endif // _RENDERBUFFER_H_

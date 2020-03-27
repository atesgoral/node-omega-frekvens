#include "DoubleBuffer.h"

DoubleBuffer::DoubleBuffer() {
  m_pBuffer = m_buffer1;
  m_pOffScreenBuffer = m_buffer2;

  uv_mutex_init(&m_bufferLock);
}

void DoubleBuffer::clear() {
  memset(m_pOffScreenBuffer, 0, 16 * 16);

  uv_mutex_lock(&m_bufferLock);

  m_pBuffer = m_pOffScreenBuffer;
  m_pOffScreenBuffer = 0; // signal to quit after rendering empty frame

  uv_mutex_unlock(&m_bufferLock);
}

void DoubleBuffer::set(const char *pBuffer) {
  memcpy(m_pOffScreenBuffer, pBuffer, 16 * 16);

  uv_mutex_lock(&m_bufferLock);

  char *pSwap = m_pBuffer;
  m_pBuffer = m_pOffScreenBuffer;
  m_pOffScreenBuffer = pSwap;

  uv_mutex_unlock(&m_bufferLock);
}

const char *DoubleBuffer::acquire() {
  uv_mutex_lock(&m_bufferLock);
  return m_pBuffer;
}

void DoubleBuffer::release() {
  uv_mutex_unlock(&m_bufferLock);
}

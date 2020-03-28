#include "RenderBuffer.h"

RenderBuffer::RenderBuffer() {
  m_pBuffer = m_buffer1;
  m_pOffScreenBuffer = m_buffer2;

  uv_mutex_init(&m_bufferLock);
}

RenderBuffer::~RenderBuffer() {
  uv_mutex_destroy(&m_bufferLock);
}

void RenderBuffer::clear() {
  uv_mutex_lock(&m_bufferLock);
  memset(m_pOffScreenBuffer, 0, 16 * 16);
  uv_mutex_unlock(&m_bufferLock);
}

void RenderBuffer::set(const char *pBuffer) {
  uv_mutex_lock(&m_bufferLock);
  memcpy(m_pOffScreenBuffer, pBuffer, 16 * 16);
  uv_mutex_unlock(&m_bufferLock);
}

const char *RenderBuffer::read() {
  uv_mutex_lock(&m_bufferLock);

  char *pSwap = m_pBuffer;
  m_pBuffer = m_pOffScreenBuffer;
  m_pOffScreenBuffer = pSwap;

  uv_mutex_unlock(&m_bufferLock);

  return m_pBuffer;
}


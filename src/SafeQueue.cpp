#include "SafeQueue.h"

SafeQueue::SafeQueue() {
  uv_mutex_init(&m_queueLock);
}

void SafeQueue::enqueue(const char *szValue) {
  uv_mutex_lock(&m_queueLock);
  m_queue.push_back(szValue);
  uv_mutex_unlock(&m_queueLock);
}

vector<string> &SafeQueue::acquire() {
  uv_mutex_lock(&m_queueLock);
  return m_queue;
}

void SafeQueue::release() {
  uv_mutex_unlock(&m_queueLock);
}

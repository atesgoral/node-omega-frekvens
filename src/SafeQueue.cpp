#include "SafeQueue.h"

template <typename T> SafeQueue<T>::SafeQueue() {
  uv_mutex_init(&m_queueLock);
}

template <typename T> void SafeQueue<T>::enqueue(T value) {
  uv_mutex_lock(&m_queueLock);
  m_queue.push_back(value);
  uv_mutex_unlock(&m_queueLock);
}

template <typename T> std::vector<T> &SafeQueue<T>::acquire() {
  uv_mutex_lock(&m_queueLock);
  return m_queue;
}

template <typename T>void SafeQueue<T>::release() {
  uv_mutex_unlock(&m_queueLock);
}

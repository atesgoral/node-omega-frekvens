#include "EventQueue.h"

EventQueue::EventQueue() {
  uv_mutex_init(&m_queueLock);
}

void EventQueue::enqueue(const char *szValue) {
  uv_mutex_lock(&m_queueLock);
  m_queue.push_back(szValue);
  uv_mutex_unlock(&m_queueLock);
}

vector<string> &EventQueue::acquire() {
  uv_mutex_lock(&m_queueLock);
  return m_queue;
}

void EventQueue::release() {
  m_queue.clear(); // @TODO odd place to do this
  uv_mutex_unlock(&m_queueLock);
}
